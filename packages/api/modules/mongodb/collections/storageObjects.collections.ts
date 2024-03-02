import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';
import DBStorageObject from '../models/dbStorageObject.model';
import { Tag } from '@core/types/api';
import { DBPaginatedResult } from '../types/pagination';

export class MongoDBStorageObjects {
  private collection?: mongoDB.Collection<DBStorageObject>;

  constructor(collection: mongoDB.Collection<DBStorageObject>) {
    this.collection = collection;
  }

  async addStorageObject(data: DBStorageObject) {
    const result = await this.collection?.insertOne(data);
  }

  async getStorageObjectById(itemId: number): Promise<DBStorageObject | null | undefined> {
    const query = { itemId: itemId };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async getStorageObjectByName(objectName: string): Promise<DBStorageObject | null | undefined> {
    const query = { objectName: objectName };
    const result = await this.collection?.findOne(query);
    return result;
  }

  async getStorageObjectByTags(
    tags: Tag[],
    limit: number,
    offset: number,
  ): Promise<DBPaginatedResult<DBStorageObject> | null | undefined> {
    const query = {
      tags: {
        $all: tags.map((tag) => ({ $elemMatch: { key: tag.key, value: tag.value } })),
      },
    };

    const totalCount = await this.collection.countDocuments(query);

    const result = await this.collection?.find(query).skip(offset).limit(limit).toArray();

    return {
      data: result,
      totalCount,
    };
  }

  async getStorageObjectByTagValues(
    tagValues: string[],
    limit: number,
    offset: number,
  ): Promise<DBPaginatedResult<DBStorageObject> | null | undefined> {
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

  async getStorageObjectByTagKeys(
    tagKeys: string[],
    limit: number,
    offset: number,
  ): Promise<DBPaginatedResult<DBStorageObject> | null | undefined> {
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
}
