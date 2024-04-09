import { StorageContent } from '@core/types/api';
import { DBStorageContent } from '@modules/mongodb/models/dbStorageContent.model';

export const adaptStorageContent = (data: DBStorageContent): StorageContent => {
  const result: StorageContent = {
    id: data.itemId,
    bucketName: data.bucketName,
    objectName: data.objectName,
    contentType: data.contentType,
    contentUrl: data.contentUrl,
  };
  return result;
};
