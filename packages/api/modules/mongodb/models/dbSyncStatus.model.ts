import { ObjectId } from 'mongodb';

export interface DBSyncStatus {
  _id?: ObjectId;
  timestamp: number;
  timestampDisplay: string;
  channel: string;
  receivedCount: number;
  paginationLimit: number;
  paginationKey: string;
  blockHeight: number;
}
