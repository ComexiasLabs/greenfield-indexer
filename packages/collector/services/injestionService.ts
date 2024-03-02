import { indexStorageBucketBulk, indexStorageObjectBulk } from './indexingService';
import logger from '@/core/logger/logger';
import { MongoDB } from '@/modules/mongodb/mongodb';
import { StorageTypes } from '@/core/types/storageTypes';
import { DBSyncStatus } from '@/modules/mongodb/models/dbSyncStatus.model';
import { DEFAULT_FETCH_BUCKET_LIMIT } from '@/core/const/constant';
import { fetchBuckets, fetchObjectsInBucket } from './storageBucketService';
import { DBStorageBucket } from '@/modules/mongodb/models/dbStorageBucket.model';
import { Environments } from '@/core/types/environments';
import { InjestionChannels } from '@/core/types/injestionChannels';

export const startInjest = async (env: Environments, type?: StorageTypes) => {
  logger.logInfo('startInjest', 'Begin');

  if (type) {
    if (type === 'Bucket') {
      await syncBuckets(env);
    }
    if (type === 'Object') {
      await syncObjects(env);
    }
  } else {
    await syncBuckets(env);
    await syncObjects(env);
  }
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
  await updateSyncStatus(env, 'Bucket', receivedCount, paginationLimit, paginationKey || '');

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
  await updateSyncStatus(env, 'Object', receivedCount, paginationLimit, paginationKey || '');

  logger.logInfo('syncObjects', 'Finish');
};

const getSyncStatus = async (
  env: Environments,
  storageType: StorageTypes,
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
  storageType: StorageTypes,
  receivedCount: number,
  paginationLimit: number,
  paginationKey: string,
) => {
  logger.logInfo('updateSyncStatus', 'Begin');

  const data: DBSyncStatus = {
    storageType,
    receivedCount,
    paginationLimit,
    paginationKey,
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
    logger.logError('getSyncStatus', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};
