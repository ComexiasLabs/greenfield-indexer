import logger from '@/core/logger/logger';
import { Environments } from '@/core/types/environments';
import { InjestionChannels } from '@/core/enum/injestionChannels';
import { syncTx } from './syncTxService';
import { bulkSyncBuckets, bulkSyncObjects } from './bulkSyncService';
import { cleanup, syncBuckets, syncObjects } from './syncMetadataService';

export const startInjest = async (env: Environments, channel?: InjestionChannels) => {
  logger.logInfo('startInjest', 'Begin');

  if (channel) {
    if (channel === InjestionChannels.Tx) {
      await syncTx(env);
    }
    if (channel === InjestionChannels.Meta) {
      await syncBuckets(env);
      await syncObjects(env);
      await cleanup(env);
    }
    if (channel === InjestionChannels.BulkBucket) {
      await bulkSyncBuckets(env);
    }
    if (channel === InjestionChannels.BulkObject) {
      await bulkSyncObjects(env);
    }
  } else {
    await syncTx(env);
    await syncBuckets(env);
    await syncObjects(env);
  }

  logger.logInfo('startInjest', 'Process completed.');
};
