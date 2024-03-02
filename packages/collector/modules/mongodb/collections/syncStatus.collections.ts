import * as mongoDB from 'mongodb';
import { DBSyncStatus } from '../models/dbSyncStatus.model';

export class MongoDBSyncStatus {
  private collection?: mongoDB.Collection<DBSyncStatus>;

  constructor(collection: mongoDB.Collection<DBSyncStatus>) {
    this.collection = collection;
  }

  async ensureIndexes() {}

  async getSyncStatus(storageType: string): Promise<DBSyncStatus | null | undefined> {
    const query = { storageType: storageType };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async upsertSyncStatus(data: DBSyncStatus) {
    const query = { storageType: data.storageType };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data }, { upsert: true });
  }
}
