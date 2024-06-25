import { deleteProcessedCache, indexStorageContent, updateStorageObjectStatus } from './indexingService';
import logger from '@/core/logger/logger';
import { MongoDB } from '@/modules/mongodb/mongodb';
import { fetchObjectContent } from './storageBucketService';
import { Environments } from '@/core/types/environments';
import { ObjectIndexStatuses } from '@/core/enum/indexStatuses';
import { DBStorageObject } from '@/modules/mongodb/models/dbStorageObject.model';
import { getContentUrl } from '@/modules/greenfield/helper';

export const syncContents = async (env: Environments) => {
  logger.logInfo('syncContents', 'Begin');

  const objectsPendingSync = await getObjectsByStatus(env, ObjectIndexStatuses.PendingContentSync);
  if (!objectsPendingSync) {
    return;
  }

  await objectsPendingSync.forEach(async (object) => {
    const content = await fetchObjectContent(env, object);

    if (content.status === 'Skipped' || !content.content) {
      await updateStorageObjectStatus(env, object.itemId, ObjectIndexStatuses.SyncComplete);
    }

    if (content.status === 'Error') {
      await updateStorageObjectStatus(env, object.itemId, ObjectIndexStatuses.ContentFetchFailed);
    }

    if (content.status === 'Successful') {
      await indexStorageContent(
        env,
        object.itemId,
        object.bucketName,
        object.objectName,
        object.contentType,
        content.content!,
        getContentUrl(env, object.bucketName, object.objectName),
      );

      await updateStorageObjectStatus(env, object.itemId, ObjectIndexStatuses.SyncComplete);
    }
  });

  logger.logInfo('syncContents', 'Finish');
};

const getObjectsByStatus = async (
  env: Environments,
  indexStatus: ObjectIndexStatuses,
): Promise<DBStorageObject[] | null | undefined> => {
  logger.logInfo('getObjectsByStatus', 'Begin');

  const database = new MongoDB();
  try {
    await database.connectToDatabase(env);
    const objects = await database.collections.storageObjects?.getStorageObjectsByStatus(indexStatus, 0, 50);

    return objects;
  } catch (e) {
    logger.logError('getObjectsByStatus', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const cleanup = async (env: Environments) => {
  logger.logInfo('cleanup', 'Begin');

  await deleteProcessedCache(env);

  logger.logInfo('cleanup', 'Finish');
};
