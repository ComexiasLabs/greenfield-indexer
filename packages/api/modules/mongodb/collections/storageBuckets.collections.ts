import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';
import DBStorageBucket from '../models/dbStorageBucket.model';
import { Tag } from '@core/types/api';
import { DBPaginatedResult } from '../types/pagination';
import logger from '@core/logger/logger';

export class MongoDBStorageBuckets {
  private collection?: mongoDB.Collection<DBStorageBucket>;

  constructor(collection: mongoDB.Collection<DBStorageBucket>) {
    this.collection = collection;
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

  async getStorageBucketByTags(
    tags: Tag[],
    limit: number,
    offset: number,
  ): Promise<DBPaginatedResult<DBStorageBucket> | null | undefined> {
    logger.logInfo('getStorageBucketByTags', `tags: ${JSON.stringify(tags)}`);

    const query = {
      tags: {
        $all: tags.map((tag) => ({ $elemMatch: { key: tag.key, value: tag.value } })),
      },
    };

    logger.logInfo('getStorageBucketByTags', `query: ${JSON.stringify(query)}`);
    console.log();
    const totalCount = await this.collection.countDocuments(query);

    const result = await this.collection?.find(query).skip(offset).limit(limit).toArray();

    return {
      data: result,
      totalCount,
    };
  }

  async getStorageBucketByTagValues(
    tagValues: string[],
    limit: number,
    offset: number,
  ): Promise<DBPaginatedResult<DBStorageBucket> | null | undefined> {
    const query = {
      tags: {
        $all: tagValues.map((tagValue) => ({ $elemMatch: { value: tagValue } })),
      },
    };

    const totalCount = await this.collection.countDocuments(query);

    const result = await this.collection?.find(query).skip(offset).limit(limit).toArray();

    return {
      data: result,
      totalCount,
    };
  }

  async getStorageBucketByTagKeys(
    tagKeys: string[],
    limit: number,
    offset: number,
  ): Promise<DBPaginatedResult<DBStorageBucket> | null | undefined> {
    const query = {
      tags: {
        $all: tagKeys.map((tagKey) => ({ $elemMatch: { key: tagKey } })),
      },
    };

    const totalCount = await this.collection.countDocuments(query);

    const result = await this.collection?.find(query).skip(offset).limit(limit).toArray();

    return {
      data: result,
      totalCount,
    };
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
}
