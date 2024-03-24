import {
  deleleStorageBucket,
  deleleStorageObject,
  indexStorageBucketBulk,
  indexStorageTags,
  updateStorageBucketStatus,
} from './indexingService';
import logger from '@/core/logger/logger';
import { MAX_FETCH_BLOCK } from '@/core/const/constant';
import { Environments } from '@/core/types/environments';
import { fetchBlock, fetchLatestBlockHeight, parseBlock } from './blockService';
import { BlockApiData } from '@/core/types/blockchainApiData';
import { getSyncStatus, updateSyncStatus } from './statusService';
import { StorageBucketApiData } from '@/core/types/storageBucketApiData';
import { BucketIndexStatuses } from '@/core/enum/bucketIndexStatuses';
import { InjestionChannels } from '@/core/enum/injestionChannels';

export const syncTx = async (env: Environments) => {
  logger.logInfo('synxTx', 'Begin');

  // Get last sync status
  const syncStatus = await getSyncStatus(env, InjestionChannels.Tx);

  const lastBlockHeight: number = !isNaN(Number(syncStatus?.blockHeight)) ? Number(syncStatus?.blockHeight) : 0;

  const latestBlockHeight = await fetchLatestBlockHeight(env);
  if (!latestBlockHeight) {
    logger.logError('syncTx', 'Failed to fetch latest block height.');
    return;
  }

  const stopBlockHeight =
    latestBlockHeight - lastBlockHeight > MAX_FETCH_BLOCK ? lastBlockHeight + MAX_FETCH_BLOCK : latestBlockHeight;

  logger.logInfo('syncTx', `latestBlockHeight: ${latestBlockHeight}, stopBlockHeight: ${stopBlockHeight}`);

  for (let i = lastBlockHeight; i < stopBlockHeight; i++) {
    const block = await fetchBlock(env, i);
    if (block) {
      await handleTxTypeMsgSetTag(env, block);
      await handleTxTypeMsgCreateBucket(env, block);
      await handleTxTypeMsgCreateObject(env, block);
      await handleTxTypeMsgDeleteBucket(env, block);
      await handleTxTypeMsgDeleteObject(env, block);
    }
  }

  await updateSyncStatus(env, InjestionChannels.Tx, 0, 0, '', stopBlockHeight);

  logger.logInfo('synxTx', 'Finish');
};

export const handleTxTypeMsgSetTag = async (env: Environments, block: BlockApiData) => {
  // MsgSetTag: Update bucket or object in db

  const parsed = parseBlock(block, '/greenfield.storage.MsgSetTag');
  if (parsed && parsed.length > 0) {
    await Promise.all(
      parsed.map(async (block) => {
        await indexStorageTags(env, block.bucketName, block.objectName || '', block.tags);
      }),
    );
  }
};

export const handleTxTypeMsgCreateBucket = async (env: Environments, block: BlockApiData) => {
  // MsgCreateBucket: Create new bucket in db, default status to PendingBucketIndex

  const parsed = parseBlock(block, '/greenfield.storage.MsgCreateBucket');
  if (parsed && parsed.length > 0) {
    const bucketsData = parsed.map((block) => {
      const data: StorageBucketApiData = {
        owner: '',
        bucket_name: block.bucketName,
        visibility: '',
        id: '',
        source_type: '',
        create_at: '',
        payment_address: '',
        global_virtual_group_family_id: 0,
        charged_read_quota: '',
        bucket_status: '',
      };
      return data;
    });

    await indexStorageBucketBulk(env, bucketsData, BucketIndexStatuses.PendingBucketSync);
  }
};

export const handleTxTypeMsgCreateObject = async (env: Environments, block: BlockApiData) => {
  // MsgCreateObject: Set bucket status to PendingObjectsIndex

  const parsed = parseBlock(block, '/greenfield.storage.MsgCreateObject');
  if (parsed && parsed.length > 0) {
    await Promise.all(
      parsed.map(async (block) => {
        await updateStorageBucketStatus(env, block.bucketName, BucketIndexStatuses.PendingObjectsSync);
      }),
    );
  }
};

export const handleTxTypeMsgDeleteBucket = async (env: Environments, block: BlockApiData) => {
  // MsgDeleteBucket: Delete bucket in db

  const parsed = parseBlock(block, '/greenfield.storage.MsgDeleteBucket');
  if (parsed && parsed.length > 0) {
    await Promise.all(
      parsed.map(async (block) => {
        if (block.bucketName) {
          await deleleStorageBucket(env, block.bucketName);
        }
      }),
    );
  }
};

export const handleTxTypeMsgDeleteObject = async (env: Environments, block: BlockApiData) => {
  // MsgDeleteBucket: Delete object in db

  const parsed = parseBlock(block, '/greenfield.storage.MsgDeleteObject');
  if (parsed && parsed.length > 0) {
    await Promise.all(
      parsed.map(async (block) => {
        if (block.bucketName && block.objectName) {
          await deleleStorageObject(env, block.bucketName, block.objectName);
        }
      }),
    );
  }
};
