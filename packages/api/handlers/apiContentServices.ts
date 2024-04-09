import { adaptStorageContent } from '@core/adapters/storageContentAdapter';
import { adaptStorageObject } from '@core/adapters/storageObjectAdapter';
import logger from '@core/logger/logger';
import { StorageContent, StorageObject } from '@core/types/api';
import { SearchModes } from '@core/types/searchModes';
import { DBStorageContent } from '@modules/mongodb/models/dbStorageContent.model';
import { MongoDB } from '@modules/mongodb/mongodb';
import { DBPaginatedResult } from '@modules/mongodb/types/pagination';

export const apiSearchContent = async (
  keyword: string,
  searchMode: SearchModes,
  limit: number,
  offset: number,
): Promise<{ data: StorageContent[]; totalCount: number }> => {
  const database = new MongoDB();
  try {
    logger.logInfo('apiSearchContent', `Begin. keyword: ${keyword}, limit: ${limit}, offset: ${offset}`);

    let data: DBPaginatedResult<DBStorageContent>;
    await database.connectToDatabase();

    const useRegex = searchMode === SearchModes.Partial ? true : false;

    data = await database.collections.storageContent?.searchStorageContent(keyword, limit, offset, useRegex);

    const result: StorageContent[] = [];
    data?.data?.forEach((item) => {
      result.push(adaptStorageContent(item));
    });

    return {
      data: result,
      totalCount: data.totalCount,
    };
  } catch (e) {
    logger.logError('apiSearchContent', 'Failed', e);
    return null;
  } finally {
    await database.disconnectFromDatabase();
  }
};
