import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';
import { DBStorageObject } from '../models/dbStorageObject.model';

export class MongoDBStorageObjects {
  private collection?: mongoDB.Collection<DBStorageObject>;

  constructor(collection: mongoDB.Collection<DBStorageObject>) {
    this.collection = collection;
  }

  async ensureIndexes() {
    await this.collection?.createIndex({ indexDate: 1 });
    await this.collection?.createIndex({ bucketName: 1 });
    await this.collection?.createIndex({ objectName: 1 });
    await this.collection?.createIndex({ 'tags.key': 1, 'tags.value': 1 });
  }

  async addStorageObject(data: DBStorageObject) {
    const result = await this.collection?.insertOne(data);
  }

  async getStorageObjectById(itemId: number): Promise<DBStorageObject | null | undefined> {
    const query = { itemId: itemId };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async updateStorageObject(id: string, data: DBStorageObject) {
    const query = { _id: new ObjectId(id) };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data });
  }

  async upsertStorageObject(data: DBStorageObject) {
    const query = { itemId: data.itemId };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data }, { upsert: true });
  }

  async updateStorageObjectTags(
    bucketName: string,
    objectName: string,
    tags: {
      key: string;
      value: string;
    }[],
  ) {
    const query = { bucketName: bucketName, objectName: objectName };
    const update = { $set: { tags: tags } };

    await this.collection?.updateOne(query, update);
  }
}
