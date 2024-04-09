import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';
import { DBStorageContent } from '../models/dbStorageContent.model';
import { DBPaginatedResult } from '../types/pagination';

export class MongoDBStorageContent {
  private collection?: mongoDB.Collection<DBStorageContent>;

  constructor(collection: mongoDB.Collection<DBStorageContent>) {
    this.collection = collection;
  }

  async searchStorageContent(
    keyword: string,
    limit: number,
    offset: number,
    useRegex: boolean = false,
  ): Promise<DBPaginatedResult<DBStorageContent> | null | undefined> {
    let query;
    if (useRegex) {
      query = { content: { $regex: keyword, $options: 'i' } };
    } else {
      query = { $text: { $search: keyword } };
    }

    const totalCount = await this.collection.countDocuments(query);

    const result = await this.collection?.find(query).skip(offset).limit(limit).toArray();

    return {
      data: result,
      totalCount,
    };
  }
}
