import { BucketIndexStatuses } from '@/core/enum/bucketIndexStatuses';
import logger from '@/core/logger/logger';
import { Environments } from '@/core/types/environments';
import { StorageBucketApiData } from '@/core/types/storageBucketApiData';
import { StorageObjectApiData } from '@/core/types/storageObjectApiData';
import { Tag } from '@/core/types/tag';
import { DBStorageBucket } from '@/modules/mongodb/models/dbStorageBucket.model';
import { DBStorageObject } from '@/modules/mongodb/models/dbStorageObject.model';
import { MongoDB } from '@/modules/mongodb/mongodb';

export const indexStorageBucketBulk = async (
  env: Environments,
  buckets: StorageBucketApiData[],
  indexStatus: BucketIndexStatuses,
) => {
  logger.logInfo('indexStorageBucketBulk', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    await Promise.all(
      buckets.map(async (bucket) => {
        const data = mapStorageBucket(bucket, indexStatus);
        await database.collections.storageBuckets?.upsertStorageBucket(data);
      }),
    );
  } catch (e) {
    logger.logError('indexStorageBucketBulk', 'Error during bucket indexing', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const indexStorageObjectBulk = async (env: Environments, objects: StorageObjectApiData[]) => {
  logger.logInfo('indexStorageObjectBulk', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    await Promise.all(
      objects.map(async (object) => {
        const data = mapStorageObject(object);
        await database.collections.storageObjects?.upsertStorageObject(data);
      }),
    );
  } catch (e) {
    logger.logError('indexStorageObjectBulk', 'Error during bucket indexing', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const mapStorageBucket = (
  rawBucket: StorageBucketApiData,
  indexStatus: BucketIndexStatuses,
): DBStorageBucket => {
  logger.logInfo('mapStorageBucket', 'Begin');

  const additionalTags = [
    { key: '_owner', value: rawBucket.owner },
    { key: '_visibility', value: rawBucket.visibility },
    { key: '_sourceType', value: rawBucket.source_type },
  ];

  const result: DBStorageBucket = {
    itemId: parseInt(rawBucket.id),
    bucketName: rawBucket.bucket_name,
    owner: rawBucket.owner,
    visibility: rawBucket.visibility,
    sourceType: rawBucket.source_type,
    bucketStatus: rawBucket.bucket_status,
    createdAtBlock: parseInt(rawBucket.create_at),
    tags: [
      ...additionalTags,
      ...(rawBucket.tags?.tags ? rawBucket.tags.tags!.map((tag) => ({ key: tag.key, value: tag.value })) : []),
    ],
    indexDate: Date.now(),
    indexStatus,
  };

  return result;
};

export const mapStorageObject = (rawObject: StorageObjectApiData): DBStorageObject => {
  const additionalTags = [
    { key: '_owner', value: rawObject.owner },
    { key: '_visibility', value: rawObject.visibility },
    { key: '_sourceType', value: rawObject.source_type },
    { key: '_contentType', value: rawObject.content_type },
  ];

  const result: DBStorageObject = {
    itemId: parseInt(rawObject.id),
    bucketName: rawObject.bucket_name,
    objectName: rawObject.object_name,
    contentType: rawObject.content_type,
    owner: rawObject.owner,
    visibility: rawObject.visibility,
    sourceType: rawObject.source_type,
    objectStatus: rawObject.object_status,
    createdAtBlock: parseInt(rawObject.create_at),
    tags: [
      ...additionalTags,
      ...(rawObject.tags ? rawObject.tags.tags!.map((tag) => ({ key: tag.key, value: tag.value })) : []),
    ],
    indexDate: Date.now(),
  };

  return result;
};

export const indexStorageTags = async (env: Environments, bucketName: string, objectName: string, tags: Tag[]) => {
  logger.logInfo('indexStorageTags', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    if (objectName) {
      await database.collections.storageObjects?.updateStorageObjectTags(bucketName, objectName, tags);
    } else {
      await database.collections.storageBuckets?.updateStorageBucketTags(bucketName, tags);
    }
  } catch (e) {
    logger.logError('indexStorageTags', 'Error', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const updateStorageBucketStatus = async (
  env: Environments,
  bucketName: string,
  indexStatus: BucketIndexStatuses,
) => {
  logger.logInfo('updateStorageBucketStatus', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    await database.collections.storageBuckets?.updateStorageBucketIndexStatus(bucketName, indexStatus);
  } catch (e) {
    logger.logError('updateStorageBucketStatus', 'Error', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const deleleStorageBucket = async (env: Environments, bucketName: string) => {
  logger.logInfo('deleleStorageBucket', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    await database.collections.storageBuckets?.deleteStorageBucketByName(bucketName);
  } catch (e) {
    logger.logError('deleleStorageBucket', 'Error', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const deleleStorageObject = async (env: Environments, bucketName: string, objectName: string) => {
  logger.logInfo('deleleStorageObject', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    await database.collections.storageObjects?.deleteStorageBucketByName(bucketName, objectName);
  } catch (e) {
    logger.logError('deleleStorageObject', 'Error', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const deleteProcessedCache = async (env: Environments) => {
  logger.logInfo('deleteProcessedCache', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);

    await database.collections.storageBuckets?.deleteStorageBucketWithNoId(BucketIndexStatuses.SyncComplete);
  } catch (e) {
    logger.logError('deleteProcessedCache', 'Error', e);
    throw e;
  } finally {
    await database.disconnectFromDatabase();
  }
};
