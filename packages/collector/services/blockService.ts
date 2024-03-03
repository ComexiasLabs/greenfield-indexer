import { Config } from '@/core/config/config';
import logger from '@/core/logger/logger';
import axios from 'axios';
import { Environments } from '@/core/types/environments';
import { BlockApiData } from '@/core/types/blockchainApiData';

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
