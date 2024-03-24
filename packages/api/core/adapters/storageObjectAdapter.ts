import { StorageObject } from '@core/types/api';
import { DBStorageObject } from '@modules/mongodb/models/dbStorageObject.model';

export const adaptStorageObject = (data: DBStorageObject): StorageObject => {
  const result: StorageObject = {
    id: data.itemId,
    bucketName: data.bucketName,
    name: data.objectName,
    contentType: data.contentType,
    tags: data.tags,
  };
  return result;
};
