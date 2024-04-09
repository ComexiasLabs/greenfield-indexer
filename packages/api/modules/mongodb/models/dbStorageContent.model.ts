import { ObjectId } from 'mongodb';

export interface DBStorageContent {
  _id?: ObjectId;
  itemId: number;
  bucketName: string;
  objectName: string;
  contentType: string;
  content?: string;
  contentUrl?: string;
  indexDate: number;
}
