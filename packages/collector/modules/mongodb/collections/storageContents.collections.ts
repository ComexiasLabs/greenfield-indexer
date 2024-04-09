import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';
import { DBStorageContent } from '../models/dbStorageContent.model';

export class MongoDBStorageContent {
  private collection?: mongoDB.Collection<DBStorageContent>;

  constructor(collection: mongoDB.Collection<DBStorageContent>) {
    this.collection = collection;
  }

  async ensureIndexes() {
    await this.collection?.createIndex({ indexDate: 1 });
    await this.collection?.createIndex({ bucketName: 1 });
    await this.collection?.createIndex({ objectName: 1 });
    await this.collection?.createIndex({ content: 'text' });
  }

  async upsertStorageContent(data: DBStorageContent) {
    const query = { itemId: data.itemId };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data }, { upsert: true });
  }

  async deleteStorageContent(bucketName: string, objectName: string) {
    const query = { bucketName: bucketName, objectName: objectName };
    // @ts-ignore
    await this.collection?.deleteOne(query);
  }
}
