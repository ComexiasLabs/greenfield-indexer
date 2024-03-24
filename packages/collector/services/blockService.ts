import { Config } from '@/core/config/config';
import logger from '@/core/logger/logger';
import axios from 'axios';
import { Environments } from '@/core/types/environments';
import { BlockApiData } from '@/core/types/blockchainApiData';
import { Tag } from '@/core/types/tag';

export const fetchLatestBlockHeight = async (env: Environments): Promise<number | null> => {
  logger.logInfo('fetchLatestBlockHeight', `Begin`);

  const rpcURL = env === 'Mainnet' ? Config.greenfieldBlockchainRPCMainnet : Config.greenfieldBlockchainRPCTestnet;
  const baseURL = `${rpcURL}/cosmos/base/tendermint/v1beta1/blocks/latest`;

  try {
    const response = await axios.get<BlockApiData>(baseURL);

    if (response.data) {
      const height = response.data.block?.header?.height;
      return height ? +height : null;
    }

    return null;
  } catch (error) {
    logger.logError('fetchLatestBlockHeight', `Failed to fetch latest block`);
    return null;
  }
};

export const fetchBlock = async (env: Environments, blockHeight: number): Promise<BlockApiData | null> => {
  logger.logInfo('fetchBlock', `Begin. blockHeight: ${blockHeight}`);

  const rpcURL = env === 'Mainnet' ? Config.greenfieldBlockchainRPCMainnet : Config.greenfieldBlockchainRPCTestnet;
  const baseURL = `${rpcURL}/cosmos/tx/v1beta1/txs/block/${blockHeight}`;

  try {
    const response = await axios.get<BlockApiData>(baseURL);

    return response.data;
  } catch (error) {
    logger.logError('fetchBlock', `Failed to fetch block: ${blockHeight}`);
    return null;
  }
};

interface ParsedBlock {
  blockHeight: number;
  bucketName: string;
  objectName?: string;
  tags: Tag[];
}
export const parseBlock = (block: BlockApiData, txType: string): ParsedBlock[] | null => {
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
          // MsgSetTag stores bucketName and objectName in `resource` field
          if (txType === 'MsgSetTag') {
            if (message['@type'] === txType && message.tags && message.tags.tags && Array.isArray(message.tags.tags)) {
              const resourceParts = message.resource.split('/');
              if (resourceParts[0] === 'grn:b:') {
                bucketName = resourceParts[2];
              } else if (resourceParts[0] === 'grn:o:') {
                bucketName = resourceParts[2];
                objectName = resourceParts.slice(3).join('/');
              }

              const tags: Tag[] = message.tags.tags.filter((tag) => tag.key && tag.value);

              result.push({
                blockHeight: parseInt(block.block.header.height),
                bucketName,
                objectName,
                tags,
              });
            }
          }
          // Other txType stores bucketName and objectName in their respective fields
          if (txType !== 'MsgSetTag') {
            if (message['@type'] === txType) {
              bucketName = message.bucket_name ?? '';
              objectName = message.object_name ?? '';

              result.push({
                blockHeight: parseInt(block.block.header.height),
                bucketName,
                objectName,
                tags,
              });
            }
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
