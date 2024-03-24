import {
  deleteProcessedCache,
  indexStorageBucketBulk,
  indexStorageObjectBulk,
  updateStorageBucketStatus,
} from './indexingService';
import logger from '@/core/logger/logger';
import { MongoDB } from '@/modules/mongodb/mongodb';
import { fetchBucketMeta, fetchObjectsInBucket } from './storageBucketService';
import { DBStorageBucket } from '@/modules/mongodb/models/dbStorageBucket.model';
import { Environments } from '@/core/types/environments';
import { BucketIndexStatuses } from '@/core/enum/bucketIndexStatuses';

export const syncBuckets = async (env: Environments) => {
  logger.logInfo('syncBuckets', 'Begin');

  const bucketsPendingSync = await getBucketsByStatus(env, BucketIndexStatuses.PendingBucketSync);
  if (!bucketsPendingSync) {
    return;
  }

  await bucketsPendingSync.forEach(async (bucket) => {
    const bucketsData = await fetchBucketMeta(env, bucket.bucketName);
    if (!bucketsData) {
      await updateStorageBucketStatus(env, bucket.bucketName, BucketIndexStatuses.BucketFetchFailed);
      return;
    }

    await indexStorageBucketBulk(env, [bucketsData.data], BucketIndexStatuses.SyncComplete);

    await updateStorageBucketStatus(env, bucket.bucketName, BucketIndexStatuses.PendingObjectsSync);
  });

  logger.logInfo('syncBuckets', 'Finish');
};

export const syncObjects = async (env: Environments) => {
  logger.logInfo('syncObjects', 'Begin');

  const bucketsPendingSync = await getBucketsByStatus(env, BucketIndexStatuses.PendingObjectsSync);
  if (!bucketsPendingSync) {
    return;
  }

  // Fetch objects in each bucket, then index them
  await bucketsPendingSync.forEach(async (bucket) => {
    const objects = await fetchObjectsInBucket(env, bucket.bucketName);
    if (!objects) {
      await updateStorageBucketStatus(env, bucket.bucketName, BucketIndexStatuses.ObjectsFetchFailed);
      return;
    }

    await indexStorageObjectBulk(env, objects.object_infos);

    await updateStorageBucketStatus(env, bucket.bucketName, BucketIndexStatuses.SyncComplete);
  });

  logger.logInfo('syncObjects', 'Finish');
};

const getBucketsByStatus = async (
  env: Environments,
  indexStatus: BucketIndexStatuses,
): Promise<DBStorageBucket[] | null | undefined> => {
  logger.logInfo('getBucketsByStatus', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);
    const buckets = await database.collections.storageBuckets?.getStorageBucketsByStatus(indexStatus, 0, 100);

    return buckets;
  } catch (e) {
    logger.logError('getBucketsByStatus', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const cleanup = async (env: Environments) => {
  logger.logInfo('cleanup', 'Begin');

  await deleteProcessedCache(env);

  logger.logInfo('cleanup', 'Finish');
};
