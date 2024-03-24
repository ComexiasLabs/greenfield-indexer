import * as mongoDB from 'mongodb';
import { DBSyncStatus } from '../models/dbSyncStatus.model';

export class MongoDBSyncStatus {
  private collection?: mongoDB.Collection<DBSyncStatus>;

  constructor(collection: mongoDB.Collection<DBSyncStatus>) {
    this.collection = collection;
  }

  async ensureIndexes() {}

  async getSyncStatus(channel: string): Promise<DBSyncStatus | null | undefined> {
    const query = { channel: channel };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async upsertSyncStatus(data: DBSyncStatus) {
    const query = { channel: data.channel };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data }, { upsert: true });
  }
}
