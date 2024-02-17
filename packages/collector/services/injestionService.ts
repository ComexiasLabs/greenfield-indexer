import {
  indexStorageBucketBulk,
  indexStorageObjectBulk,
} from "./indexingService";
import logger from "@/core/logger/logger";
import { MongoDB } from "@/modules/mongodb/mongodb";
import { StorageTypes } from "@/core/types/storageTypes";
import { DBSyncStatus } from "@/modules/mongodb/models/dbSyncStatus.model";
import {
  DEFAULT_FETCH_BUCKET_LIMIT,
} from "@/core/const/constant";
import { fetchBuckets, fetchObjectsInBucket } from "./storageBucketService";
import { DBStorageBucket } from "@/modules/mongodb/models/dbStorageBucket.model";

export const startInjest = async (type?: StorageTypes) => {
  logger.logInfo("startInjest", "Begin");

  if (type) {
    if (type === "Bucket") {
      await syncBuckets();
    }
    if (type === "Object") {
      await syncObjects();
    }
  } else {
    await syncBuckets();
    await syncObjects();
  }
};

export const syncBuckets = async () => {
  logger.logInfo("syncBuckets", "Begin");

  // Get last sync status
  const syncStatus = await getSyncStatus("Bucket");

  // Fetch buckets data
  const bucketsData = await fetchBuckets(syncStatus?.paginationKey);

  // Index buckets
  await indexStorageBucketBulk(bucketsData.bucket_infos);

  // Update sync status
  const receivedCount =
    (syncStatus?.receivedCount || 0) + bucketsData.bucket_infos.length;
  const paginationLimit = DEFAULT_FETCH_BUCKET_LIMIT;
  let paginationKey = bucketsData.pagination.next_key;
  await updateSyncStatus(
    "Bucket",
    receivedCount,
    paginationLimit,
    paginationKey || ""
  );

  logger.logInfo("syncBuckets", "Finish");
};

export const syncObjects = async () => {
  logger.logInfo("syncObjects", "Begin");

  // Get last sync status
  const syncStatus = await getSyncStatus("Object");

  const indexDateSince: number = !isNaN(Number(syncStatus?.paginationKey))
    ? Number(syncStatus?.paginationKey)
    : 0;

  // Fetch bucket names from index
  const buckets = await getBucketsToSync(indexDateSince);
  if (!buckets || buckets.length === 0) {
    logger.logInfo("syncObjects", "Nothing to sync");
    return;
  }

  // Fetch objects in each bucket, then index them
  let objectsIndexed = 0;
  buckets.forEach(async (bucket) => {
    const objects = await fetchObjectsInBucket(bucket.bucketName);

    if (objects.object_infos) {
      objectsIndexed += objects.object_infos.length;
    }

    // Index objects in bucket
    await indexStorageObjectBulk(objects.object_infos);
  });

  // Update sync status
  const receivedCount = (syncStatus?.receivedCount || 0) + objectsIndexed;
  const paginationLimit = DEFAULT_FETCH_BUCKET_LIMIT;
  let paginationKey = `${buckets[buckets.length - 1].indexDate}`; // paginationKey for objects is the last bucket indexDate
  await updateSyncStatus(
    "Object",
    receivedCount,
    paginationLimit,
    paginationKey || ""
  );

  logger.logInfo("syncObjects", "Finish");
};

const getSyncStatus = async (
  storageType: StorageTypes
): Promise<DBSyncStatus | null | undefined> => {
  logger.logInfo("getSyncStatus", "Begin");

  const database = new MongoDB();
  try {
    await database.connectToDatabase();
    const syncStatus = await database.collections.syncStatus?.getSyncStatus(
      storageType
    );
    return syncStatus;
  } catch (e) {
    logger.logError("getSyncStatus", "Failed", e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

const updateSyncStatus = async (
  storageType: StorageTypes,
  receivedCount: number,
  paginationLimit: number,
  paginationKey: string
) => {
  logger.logInfo("updateSyncStatus", "Begin");

  const data: DBSyncStatus = {
    storageType,
    receivedCount,
    paginationLimit,
    paginationKey,
  };

  const database = new MongoDB();
  try {
    await database.connectToDatabase();

    const syncStatus = await database.collections.syncStatus?.upsertSyncStatus(
      data
    );

    return syncStatus;
  } catch (e) {
    logger.logError("getSyncStatus", "Failed", e);
  } finally {
    await database.disconnectFromDatabase();
  }
};

const getBucketsToSync = async (
  indexDateSince: number
): Promise<DBStorageBucket[] | null | undefined> => {
  logger.logInfo("getBucketsToSync", "Begin");

  const database = new MongoDB();
  try {
    await database.connectToDatabase();
    const buckets =
      await database.collections.storageBuckets?.getStorageBucketsByIndexDate(
        indexDateSince,
        0,
        100
      );

    return buckets;
  } catch (e) {
    logger.logError("getSyncStatus", "Failed", e);
  } finally {
    await database.disconnectFromDatabase();
  }
};
