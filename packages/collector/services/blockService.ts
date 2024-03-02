import { Config } from '@/core/config/config';
import logger from '@/core/logger/logger';
import axios from 'axios';
import { Environments } from '@/core/types/environments';
import { BlockApiData } from '@/core/types/blockchainApiData';

export const fetchBlock = async (env: Environments, blockHeight: number): Promise<BlockApiData> => {
  logger.logInfo('fetchBlock', `Begin. blockHeight: ${blockHeight}`);

  const rpcURL = env === 'Mainnet' ? Config.greenfieldBlockchainRPCMainnet : Config.greenfieldBlockchainRPCTestnet;
  const baseURL = `${rpcURL}//cosmos/tx/v1beta1/txs/block/${blockHeight}`;

  try {
    const response = await axios.get<BlockApiData>(baseURL);

    return response.data;
  } catch (error) {
    logger.logError('fetchBlock', `Failed to fetch block: ${blockHeight}`);
    throw new Error('Failed to fetch block data');
  }
};
