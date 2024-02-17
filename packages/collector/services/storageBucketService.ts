import { Config } from "@/core/config/config";
import { BUCKETS_DATA_FILEPATH, DEFAULT_FETCH_BUCKET_LIMIT, OBJECTS_DATA_FILEPATH } from "@/core/const/constant";
import logger from "@/core/logger/logger";
import { FetchBucketsResponse, StorageBucketApiData } from "@/core/types/storageBucketApiData";
import { FetchObjectsResponse } from "@/core/types/storageObjectApiData";
import axios from "axios";
import { writeToJsonFile } from "./fileService";

export const fetchBuckets = async (
  paginationKey?: string
): Promise<FetchBucketsResponse> => {
    logger.logInfo('fetchBuckets', `Begin. paginationKey: ${paginationKey}`);
    
  const baseURL = `${Config.greenfieldBlockchainRPC}/greenfield/storage/list_buckets`;
  const params = new URLSearchParams({
    "pagination.limit": `${DEFAULT_FETCH_BUCKET_LIMIT}`,
  });

  if (paginationKey) {
    params.append("pagination.key", paginationKey);
  }

  try {
    const response = await axios.get<FetchBucketsResponse>(baseURL, {
      params: params,
    });

    if (response.data && response.data.bucket_infos) {

      // Write to data file
      if (Config.environment === 'local') {
        writeToJsonFile(`${BUCKETS_DATA_FILEPATH}/data-limit-${DEFAULT_FETCH_BUCKET_LIMIT}-paginationkey-${(paginationKey)}.json`, response.data);
      }
      
      return response.data;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Failed to fetch buckets data:", error);
    throw new Error("Failed to fetch buckets data");
  }
};

export const fetchObjectsInBucket = async (
  bucketName: string
): Promise<FetchObjectsResponse> => {
    logger.logInfo('fetchBuckets', `Begin. bucketName: ${bucketName}`);
    
  const baseURL = `${Config.greenfieldBlockchainRPC}/greenfield/storage/list_objects/${bucketName}`;

  try {
    const response = await axios.get<FetchObjectsResponse>(baseURL);

    if (response.data && response.data.object_infos) {

      // Write to data file
      if (Config.environment === 'local') {
        writeToJsonFile(`${OBJECTS_DATA_FILEPATH}/data-bucketname-${bucketName}.json`, response.data);
      }

      return response.data;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Failed to fetch buckets data:", error);
    throw new Error("Failed to fetch buckets data");
  }
};
