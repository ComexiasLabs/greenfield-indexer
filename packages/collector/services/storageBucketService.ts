import { Config } from '@/core/config/config';
import { DEFAULT_FETCH_BUCKET_LIMIT } from '@/core/const/constant';
import logger from '@/core/logger/logger';
import { FetchBucketMetaResponse, FetchBucketsResponse, StorageBucketApiData } from '@/core/types/storageBucketApiData';
import { FetchObjectsResponse } from '@/core/types/storageObjectApiData';
import axios from 'axios';
import { Environments } from '@/core/types/environments';
import { parseStringPromise } from 'xml2js';
import { DBStorageObject } from '@/modules/mongodb/models/dbStorageObject.model';

export const fetchBuckets = async (env: Environments, paginationKey?: string): Promise<FetchBucketsResponse> => {
  logger.logInfo('fetchBuckets', `Begin. paginationKey: ${paginationKey}`);

  const rpcURL = env === 'Mainnet' ? Config.greenfieldBlockchainRPCMainnet : Config.greenfieldBlockchainRPCTestnet;
  const baseURL = `${rpcURL}/greenfield/storage/list_buckets`;
  const params = new URLSearchParams({
    'pagination.limit': `${DEFAULT_FETCH_BUCKET_LIMIT}`,
  });

  if (paginationKey) {
    params.append('pagination.key', paginationKey);
  }

  try {
    const response = await axios.get<FetchBucketsResponse>(baseURL, {
      params: params,
    });

    if (response.data && response.data.bucket_infos) {
      return response.data;
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    logger.logError('fetchBuckets', 'Error', error);
    throw new Error('Failed to fetch buckets data');
  }
};

export const fetchObjectsInBucket = async (
  env: Environments,
  bucketName: string,
): Promise<FetchObjectsResponse | null> => {
  logger.logInfo('fetchObjectsInBucket', `Begin. bucketName: ${bucketName}`);

  if (!bucketName) {
    return null;
  }

  const rpcURL = env === 'Mainnet' ? Config.greenfieldBlockchainRPCMainnet : Config.greenfieldBlockchainRPCTestnet;
  const baseURL = `${rpcURL}/greenfield/storage/list_objects/${bucketName}`;

  try {
    const response = await axios.get<FetchObjectsResponse>(baseURL);

    if (response.data && response.data.object_infos) {
      return response.data;
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      logger.logWarning('fetchObjectsInBucket', `Requested bucket metadata not found for bucketName: ${bucketName}`);
      return null;
    } else {
      logger.logError('fetchObjectsInBucket', 'Error', error);
      return null;
    }
  }
};

export const fetchBucketMeta = async (
  env: Environments,
  bucketName: string,
): Promise<FetchBucketMetaResponse | null> => {
  logger.logInfo('fetchBucketMeta', `Begin. bucketName: ${bucketName}`);

  if (!bucketName) {
    return null;
  }

  const storageProvider =
    env === 'Mainnet' ? Config.greenfieldStorageProviderMainnet : Config.greenfieldStorageProviderTestnet;
  const baseURL = `https://${bucketName}.${storageProvider}/?bucket-meta`;

  try {
    console.log(`baseURL: ${baseURL}`);
    const response = await axios.get(baseURL);

    const parsedResult = await parseStringPromise(response.data);

    // Check if return not found code
    if (parsedResult?.Error?.Code === '90008') {
      return null;
    }

    const bucketMeta = parsedResult.GfSpGetBucketMetaResponse.Bucket[0].BucketInfo[0];

    const tags =
      bucketMeta.Tags && bucketMeta.Tags[0] !== ''
        ? bucketMeta.Tags[0].Tags.map((tag: { Key: any[]; Value: any[] }) => ({
            key: tag.Key[0],
            value: tag.Value[0],
          }))
        : null;

    const result = {
      data: {
        owner: bucketMeta.Owner[0],
        bucket_name: bucketMeta.BucketName[0],
        visibility: bucketMeta.Visibility[0],
        id: bucketMeta.Id[0],
        source_type: bucketMeta.SourceType[0],
        create_at: bucketMeta.CreateAt[0],
        payment_address: bucketMeta.PaymentAddress[0],
        global_virtual_group_family_id: parseInt(bucketMeta.GlobalVirtualGroupFamilyId[0], 10),
        charged_read_quota: bucketMeta.ChargedReadQuota[0],
        bucket_status: bucketMeta.BucketStatus[0],
        tags: { tags },
      },
    };

    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      logger.logWarning('fetchBucketMeta', `Requested bucket metadata not found for bucketName: ${bucketName}`);
      return null;
    } else {
      logger.logError('fetchBucketMeta', 'Error', error);
      return null;
    }
  }
};

interface FetchObjectContentResponse {
  status: 'Skipped' | 'Error' | 'Successful';
  content?: string;
}

export const fetchObjectContent = async (
  env: Environments,
  object: DBStorageObject,
): Promise<FetchObjectContentResponse> => {
  if (!object) {
    return {
      status: 'Skipped',
    };
  }

  if (object.visibility !== 'VISIBILITY_TYPE_PUBLIC_READ') {
    return {
      status: 'Skipped',
    };
  }

  // TODO: Currently supporting only txt files (eg: https://mark.greenfield-sp.bnbchain.org/test.txt)
  if (!(object.contentType === 'text/plain' && object.objectName.endsWith('.txt'))) {
    return {
      status: 'Skipped',
    };
  }

  const maxDownloadBytes = 102400; // 100KB

  const storageProvider =
    env === 'Mainnet' ? Config.greenfieldStorageProviderMainnet : Config.greenfieldStorageProviderTestnet;
  const contentUrl = `https://${object.bucketName}.${storageProvider}/${object.objectName}`;

  logger.logInfo('fetchObjectContent', `Fetching object: ${contentUrl}`);

  try {
    const response = await axios.get(contentUrl, {
      headers: { Range: `bytes=0-${maxDownloadBytes - 1}` },
      responseType: 'text',
    });

    return {
      status: 'Successful',
      content: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        logger.logWarning('fetchObjectContent', `Requested object content not found: ${contentUrl}`);
      } else if (error.response?.status === 416) {
        logger.logWarning('fetchObjectContent', `Requested range not satisfiable: ${contentUrl}`);
      } else {
        logger.logError('fetchObjectContent', 'Axios Error', error);
      }
    } else {
      logger.logError('fetchObjectContent', 'Unhandled error', error);
    }
    return {
      status: 'Error',
    };
  }
};
