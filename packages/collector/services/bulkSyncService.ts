import { indexStorageBucketBulk, indexStorageObjectBulk } from './indexingService';
import logger from '@/core/logger/logger';
import { MongoDB } from '@/modules/mongodb/mongodb';
import { DEFAULT_FETCH_BUCKET_LIMIT } from '@/core/const/constant';
import { fetchBuckets, fetchObjectsInBucket } from './storageBucketService';
import { DBStorageBucket } from '@/modules/mongodb/models/dbStorageBucket.model';
import { Environments } from '@/core/types/environments';
import { getSyncStatus, updateSyncStatus } from './statusService';
import { BucketIndexStatuses, ObjectIndexStatuses } from '@/core/enum/indexStatuses';
import { InjestionChannels } from '@/core/enum/injestionChannels';

export const bulkSyncBuckets = async (env: Environments) => {
  logger.logInfo('syncInitialBuckets', 'Begin');

  // Get last sync status
  const syncStatus = await getSyncStatus(env, InjestionChannels.BulkBucket);

  // Fetch buckets data
  const bucketsData = await fetchBuckets(env, syncStatus?.paginationKey);

  // Index buckets
  await indexStorageBucketBulk(env, bucketsData.bucket_infos, BucketIndexStatuses.SyncComplete);

  // Update sync status
  const receivedCount = (syncStatus?.receivedCount || 0) + bucketsData.bucket_infos.length;
  const paginationLimit = DEFAULT_FETCH_BUCKET_LIMIT;
  let paginationKey = bucketsData.pagination.next_key;
  await updateSyncStatus(env, InjestionChannels.BulkBucket, receivedCount, paginationLimit, paginationKey || '', 0);

  logger.logInfo('syncInitialBuckets', 'Finish');
};

export const bulkSyncObjects = async (env: Environments) => {
  logger.logInfo('syncInitialObjects', 'Begin');

  // Get last sync status
  const syncStatus = await getSyncStatus(env, InjestionChannels.BulkObject);

  const indexDateSince: number = !isNaN(Number(syncStatus?.paginationKey)) ? Number(syncStatus?.paginationKey) : 0;

  // Fetch bucket names from index
  const buckets = await getBucketsToSync(env, indexDateSince);
  if (!buckets || buckets.length === 0) {
    logger.logInfo('syncInitialObjects', 'Nothing to sync');
    return;
  }

  // Fetch objects in each bucket, then index them
  let objectsIndexed = 0;
  await buckets.forEach(async (bucket) => {
    const objects = await fetchObjectsInBucket(env, bucket.bucketName);
    if (!objects) {
      return;
    }

    if (objects.object_infos) {
      objectsIndexed += objects.object_infos.length;
    }

    // Index objects in bucket
    await indexStorageObjectBulk(env, objects.object_infos, ObjectIndexStatuses.PendingContentSync);
  });

  // Update sync status
  const receivedCount = (syncStatus?.receivedCount || 0) + objectsIndexed;
  const paginationLimit = DEFAULT_FETCH_BUCKET_LIMIT;
  let paginationKey = `${buckets[buckets.length - 1].indexDate}`; // paginationKey for objects is the last bucket indexDate
  await updateSyncStatus(env, InjestionChannels.BulkObject, receivedCount, paginationLimit, paginationKey || '', 0);

  logger.logInfo('syncInitialObjects', 'Finish');
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
