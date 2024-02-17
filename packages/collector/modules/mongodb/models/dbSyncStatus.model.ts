import { Tag } from '@/core/types/tag';
import { ObjectId } from 'mongodb';

export interface DBSyncStatus {
  _id?: ObjectId;
  storageType: string;
  receivedCount: number;
  paginationLimit: number;
  paginationKey: string;
}
