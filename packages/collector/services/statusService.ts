import logger from '@/core/logger/logger';
import { MongoDB } from '@/modules/mongodb/mongodb';
import { DBSyncStatus } from '@/modules/mongodb/models/dbSyncStatus.model';
import { Environments } from '@/core/types/environments';
import { InjestionChannels } from '@/core/enum/injestionChannels';
import { formatDate } from '@/core/utils/dateUtils';

export const getSyncStatus = async (
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

export const updateSyncStatus = async (
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
    logger.logError('updateSyncStatus', 'Failed', e);
  } finally {
    await database.disconnectFromDatabase();
  }
};
