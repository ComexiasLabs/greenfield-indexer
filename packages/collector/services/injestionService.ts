import { indexStorageBucketBulk, indexStorageObjectBulk, indexStorageTags } from './indexingService';
import logger from '@/core/logger/logger';
import { MongoDB } from '@/modules/mongodb/mongodb';
import { StorageTypes } from '@/core/types/storageTypes';
import { DBSyncStatus } from '@/modules/mongodb/models/dbSyncStatus.model';
import { DEFAULT_FETCH_BUCKET_LIMIT, MAX_FETCH_BLOCK } from '@/core/const/constant';
import { fetchBuckets, fetchObjectsInBucket } from './storageBucketService';
import { DBStorageBucket } from '@/modules/mongodb/models/dbStorageBucket.model';
import { Environments } from '@/core/types/environments';
import { InjestionChannels } from '@/core/types/injestionChannels';
import { formatDate } from '@/core/utils/dateUtils';
import { fetchBlock, fetchLatestBlockHeight } from './blockService';
import { BlockApiData } from '@/core/types/blockchainApiData';
import { Tag } from '@/core/types/tag';

export const startInjest = async (env: Environments, channel?: InjestionChannels) => {
  logger.logInfo('startInjest', 'Begin');

  if (channel) {
    if (channel === 'Bucket') {
      await syncBuckets(env);
    }
    if (channel === 'Object') {
      await syncObjects(env);
    }
    if (channel === 'Tx') {
      await syncTx(env);
    }
  } else {
    await syncBuckets(env);
    await syncObjects(env);
    await syncTx(env);
  }

  logger.logInfo('startInjest', 'Process completed.');
};

export const syncBuckets = async (env: Environments) => {
  logger.logInfo('syncBuckets', 'Begin');

  // Get last sync status
  const syncStatus = await getSyncStatus(env, 'Bucket');

  // Fetch buckets data
  const bucketsData = await fetchBuckets(env, syncStatus?.paginationKey);

  // Index buckets
  await indexStorageBucketBulk(env, bucketsData.bucket_infos);

  // Update sync status
  const receivedCount = (syncStatus?.receivedCount || 0) + bucketsData.bucket_infos.length;
  const paginationLimit = DEFAULT_FETCH_BUCKET_LIMIT;
  let paginationKey = bucketsData.pagination.next_key;
  await updateSyncStatus(env, 'Bucket', receivedCount, paginationLimit, paginationKey || '', 0);

  logger.logInfo('syncBuckets', 'Finish');
};

export const syncObjects = async (env: Environments) => {
  logger.logInfo('syncObjects', 'Begin');

  // Get last sync status
  const syncStatus = await getSyncStatus(env, 'Object');

  const indexDateSince: number = !isNaN(Number(syncStatus?.paginationKey)) ? Number(syncStatus?.paginationKey) : 0;

  // Fetch bucket names from index
  const buckets = await getBucketsToSync(env, indexDateSince);
  if (!buckets || buckets.length === 0) {
    logger.logInfo('syncObjects', 'Nothing to sync');
    return;
  }

  // Fetch objects in each bucket, then index them
  let objectsIndexed = 0;
  buckets.forEach(async (bucket) => {
    const objects = await fetchObjectsInBucket(env, bucket.bucketName);

    if (objects.object_infos) {
      objectsIndexed += objects.object_infos.length;
    }

    // Index objects in bucket
    await indexStorageObjectBulk(env, objects.object_infos);
  });

  // Update sync status
  const receivedCount = (syncStatus?.receivedCount || 0) + objectsIndexed;
  const paginationLimit = DEFAULT_FETCH_BUCKET_LIMIT;
  let paginationKey = `${buckets[buckets.length - 1].indexDate}`; // paginationKey for objects is the last bucket indexDate
  await updateSyncStatus(env, 'Object', receivedCount, paginationLimit, paginationKey || '', 0);

  logger.logInfo('syncObjects', 'Finish');
};

export const syncTx = async (env: Environments) => {
  logger.logInfo('synxTx', 'Begin');

  // Get last sync status
  const syncStatus = await getSyncStatus(env, 'Tx');

  const lastBlockHeight: number = !isNaN(Number(syncStatus?.blockHeight)) ? Number(syncStatus?.blockHeight) : 0;

  // Fetch latest block
  const latestBlockHeight = await fetchLatestBlockHeight(env);
  if (!latestBlockHeight) {
    logger.logError('syncTx', 'Failed to fetch latest block height.');
    return;
  }

  console.log(`latestBlockHeight: ${latestBlockHeight}`);

  // Fetch objects in each bucket, then index them
  const stopBlockHeight =
    latestBlockHeight - lastBlockHeight > MAX_FETCH_BLOCK ? lastBlockHeight + MAX_FETCH_BLOCK : latestBlockHeight;

  console.log(`stopBlockHeight: ${stopBlockHeight}`);

  for (let i = lastBlockHeight; i < stopBlockHeight; i++) {
    const block = await fetchBlock(env, i);
    if (block) {
      const parsed = parseBlock(block, '/greenfield.storage.MsgSetTag');
      if (parsed && parsed.length > 0) {
        await Promise.all(
          parsed.map(async (block) => {
            await indexStorageTags(env, block.bucketName, block.objectName || '', block.tags);
          }),
        );
      }
    }
  }

  // Update sync status
  await updateSyncStatus(env, 'Tx', 0, 0, '', stopBlockHeight);

  logger.logInfo('synxTx', 'Finish');
};

const getSyncStatus = async (
  env: Environments,
  storageType: InjestionChannels,
): Promise<DBSyncStatus | null | undefined> => {
  logger.logInfo('getSyncStatus', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);
    const syncStatus = await database.collections.syncStatus?.getSyncStatus(storageType);
    return syncStatus;
  } catch (e) {
    logger.logError('getSyncStatus', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

const updateSyncStatus = async (
  env: Environments,
  channel: InjestionChannels,
  receivedCount: number,
  paginationLimit: number,
  paginationKey: string,
  blockHeight: number,
) => {
  logger.logInfo('updateSyncStatus', 'Begin');

  const data: DBSyncStatus = {
    channel,
    receivedCount,
    paginationLimit,
    paginationKey,
    timestamp: Date.now(),
    timestampDisplay: formatDate(new Date()),
    blockHeight,
  };

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    const syncStatus = await database.collections.syncStatus?.upsertSyncStatus(data);

    return syncStatus;
  } catch (e) {
    logger.logError('getSyncStatus', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

const getBucketsToSync = async (
  env: Environments,
  indexDateSince: number,
): Promise<DBStorageBucket[] | null | undefined> => {
  logger.logInfo('getBucketsToSync', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);
    const buckets = await database.collections.storageBuckets?.getStorageBucketsByIndexDate(indexDateSince, 0, 100);

    return buckets;
  } catch (e) {
    logger.logError('getBucketsToSync', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

interface ParsedBlock {
  bucketName: string;
  objectName?: string;
  tags: Tag[];
}
const parseBlock = (block: BlockApiData, txType: string): ParsedBlock[] | null => {
  try {
    const result: ParsedBlock[] = [];
    const tags: Tag[] = [];
    let bucketName = '';
    let objectName;

    if (!block || !block.txs || !Array.isArray(block.txs)) {
      return null;
    }

    for (const tx of block.txs) {
      if (tx.body && tx.body.messages && Array.isArray(tx.body.messages)) {
        for (const message of tx.body.messages) {
          if (message['@type'] === txType && message.tags && message.tags.tags && Array.isArray(message.tags.tags)) {
            // Parsing resource to assign bucketName and objectName
            const resourceParts = message.resource.split('/');
            if (resourceParts[0] === 'grn:b:') {
              bucketName = resourceParts[2];
            } else if (resourceParts[0] === 'grn:o:') {
              bucketName = resourceParts[2];
              objectName = resourceParts.slice(3).join('/');
            }

            const tags: Tag[] = message.tags.tags.filter((tag) => tag.key && tag.value);

            result.push({
              bucketName,
              objectName,
              tags,
            });
          }
        }
      }
    }

    return result;
  } catch (e) {
    logger.logError('parseBlock', 'Failed', e);
    return null;
  }
};
