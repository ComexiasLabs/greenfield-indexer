import { adaptStorageObject } from "@core/adapters/storageObjectAdapter";
import { determineTagFormat } from "@core/helpers/apiRequestHelper";
import logger from "@core/logger/logger";
import { StorageObject, Tag } from "@core/types/api";
import DBStorageObject from "@modules/mongodb/models/dbStorageObject.model";
import { MongoDB } from "@modules/mongodb/mongodb";
import { DBPaginatedResult } from "@modules/mongodb/types/pagination";

export const apiFetchObjectsByTags = async (
  tags: Tag[],
  limit: number,
  offset: number
): Promise<{ data: StorageObject[]; totalCount: number }> => {
  const database = new MongoDB();
  try {
    logger.logInfo(
      "apiFetchObjectsByTags",
      `Begin. tags: ${JSON.stringify(tags)}, limit: ${limit}, offset: ${offset}`
    );

    const tagFormat = determineTagFormat(tags);

    let data: DBPaginatedResult<DBStorageObject>;
    await database.connectToDatabase();

    if (tagFormat === "KeyValue") {
      data = await database.collections.storageObjects?.getStorageObjectByTags(
        tags,
        limit,
        offset
      );
    }
    if (tagFormat === "Key") {
      data =
        await database.collections.storageObjects?.getStorageObjectByTagKeys(
          tags.map((item) => item.key),
          limit,
          offset
        );
    }
    if (tagFormat === "Value") {
      data =
        await database.collections.storageObjects?.getStorageObjectByTagValues(
          tags.map((item) => item.value),
          limit,
          offset
        );
    }

    const result: StorageObject[] = [];
    data?.data?.forEach((item) => {
      result.push(adaptStorageObject(item));
    });

    return {
      data: result,
      totalCount: data.totalCount,
    };
  } catch (e) {
    logger.logError("apiFetchObjectsByTags", "Failed", e);
    return null;
  } finally {
    await database.disconnectFromDatabase();
  }
};

export const apiFetchObjectById = async (
  id: number
): Promise<StorageObject | undefined | null> => {
  const database = new MongoDB();
  try {
    logger.logInfo("apiFetchObjectById", `Begin. id: ${id}`);

    await database.connectToDatabase();

    const data =
      await database.collections.storageObjects?.getStorageObjectById(id);
    if (!data) {
      return null;
    }

    return adaptStorageObject(data);
  } catch (e) {
    logger.logError("apiFetchObjectById", "Failed", e);
    return null;
  } finally {
    await database.disconnectFromDatabase();
  }
};
