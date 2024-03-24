import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';
import { DBStorageBucket } from '../models/dbStorageBucket.model';

export class MongoDBStorageBuckets {
  private collection?: mongoDB.Collection<DBStorageBucket>;

  constructor(collection: mongoDB.Collection<DBStorageBucket>) {
    this.collection = collection;
  }

  async ensureIndexes() {
    await this.collection?.createIndex({ indexDate: 1 });
    await this.collection?.createIndex({ bucketName: 1 });
    await this.collection?.createIndex({ bucketName: 'text' });
    await this.collection?.createIndex({ 'tags.key': 1, 'tags.value': 1 });
  }

  async addStorageBucket(data: DBStorageBucket) {
    const result = await this.collection?.insertOne(data);
  }

  async getStorageBucketById(itemId: number): Promise<DBStorageBucket | null | undefined> {
    const query = { itemId: itemId };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async getStorageBucketByName(bucketName: string): Promise<DBStorageBucket | null | undefined> {
    const query = { bucketName: bucketName };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async getStorageBucketsByIndexDate(
    indexDateSince: number,
    offset: number,
    limit: number,
  ): Promise<DBStorageBucket[] | null | undefined> {
    const query = {
      indexDate: {
        $gte: indexDateSince,
      },
    };

    const result = await this.collection?.find(query).sort({ indexDate: 1 }).skip(offset).limit(limit).toArray();

    return result;
  }

  async getStorageBucketsByStatus(
    indexStatus: string,
    offset: number,
    limit: number,
  ): Promise<DBStorageBucket[] | null | undefined> {
    const query = { indexStatus: indexStatus };
    const result = await this.collection?.find(query).sort({ indexDate: 1 }).skip(offset).limit(limit).toArray();

    return result;
  }

  async updateStorageBucket(id: string, data: DBStorageBucket) {
    const query = { _id: new ObjectId(id) };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data });
  }

  async upsertStorageBucket(data: DBStorageBucket) {
    const query = { itemId: data.itemId };
    // @ts-ignore
    await this.collection?.updateOne(query, { $set: data }, { upsert: true });
  }

  async updateStorageBucketTags(
    bucketName: string,
    tags: {
      key: string;
      value: string;
    }[],
  ) {
    const query = { bucketName: bucketName };
    const update = { $set: { tags: tags } };

    await this.collection?.updateOne(query, update);
  }

  async updateStorageBucketIndexStatus(bucketName: string, indexStatus: string) {
    const query = { bucketName: bucketName };
    const update = { $set: { indexStatus: indexStatus } };

    await this.collection?.updateMany(query, update);
  }

  async deleteStorageBucketByName(bucketName: string) {
    const query = { bucketName: bucketName };
    await this.collection?.deleteOne(query);
  }

  async deleteStorageBucketWithNoId(indexStatus: string) {
    const query = {
      bucketStatus: '',
      indexStatus: indexStatus,
    };
    await this.collection?.deleteOne(query);
  }
}
