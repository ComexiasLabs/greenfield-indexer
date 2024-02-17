import { adaptStorageBucket } from "@core/adapters/storageBucketAdapter";
import { determineTagFormat } from "@core/helpers/apiRequestHelper";
import logger from "@core/logger/logger";
import { StorageBucket, Tag } from "@core/types/api";
import DBStorageBucket from "@modules/mongodb/models/dbStorageBucket.model";
import { MongoDB } from "@modules/mongodb/mongodb";
import { DBPaginatedResult } from "@modules/mongodb/types/pagination";

export const apiFetchBucketsByTags = async (
  tags: Tag[],
  limit: number,
  offset: number
): Promise<{ data: StorageBucket[], totalCount: number }> => {
  const database = new MongoDB();
  try {
    logger.logInfo(
      "apiFetchBucketsByTags",
      `Begin. tags: ${tags}, limit: ${limit}, offset: ${offset}`
    );

    const tagFormat = determineTagFormat(tags);

    let data: DBPaginatedResult<DBStorageBucket>;
    await database.connectToDatabase();

    if (tagFormat === "KeyValue") {
      data = await database.collections.storageBuckets?.getStorageBucketByTags(
        tags,
        limit,
        offset
      );
    }
    if (tagFormat === "Key") {
      data = await database.collections.storageBuckets?.getStorageBucketByTagKeys(
        tags.map(item => item.key),
        limit,
        offset
      );
    }
    if (tagFormat === "Value") {
      data = await database.collections.storageBuckets?.getStorageBucketByTagValues(
        tags.map(item => item.value),
        limit,
        offset
      );
    }

    const result: StorageBucket[] = [];
    data?.data?.forEach((item) => {
      result.push(adaptStorageBucket(item));
    });

    return {
      data: result,
      totalCount: data.totalCount,
    };
  } catch (e) {
    logger.logError("apiFetchBucketsByTags", "Failed", e);
    return null;
  } finally {
    await database.disconnectFromDatabase();
  }
};
