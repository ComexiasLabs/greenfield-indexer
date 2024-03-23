import { InjestionChannels } from '@core/enum/injestionChannels';
import logger from '@core/logger/logger';
import { MongoDB } from '@modules/mongodb/mongodb';

export const apiFetchSyncStatus = async (): Promise<{ lastIndexBlockHeight: number } | undefined | null> => {
  const database = new MongoDB();
  try {
    logger.logInfo('apiFetchSyncStatus', 'Begin');

    await database.connectToDatabase();

    const data = await database.collections.syncStatus?.getSyncStatus(InjestionChannels.Tx);
    if (!data) {
      return null;
    }

    return {
      lastIndexBlockHeight: data.blockHeight,
    };
  } catch (e) {
    logger.logError('apiFetchSyncStatus', 'Failed', e);
    return null;
  } finally {
    await database.disconnectFromDatabase();
  }
};
