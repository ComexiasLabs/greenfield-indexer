import { StorageBucket } from '@core/types/api';
import { DBStorageBucket } from '@modules/mongodb/models/dbStorageBucket.model';

export const adaptStorageBucket = (data: DBStorageBucket): StorageBucket => {
  const result: StorageBucket = {
    id: data.itemId,
    name: data.bucketName,
    tags: data.tags,
  };
  return result;
};
