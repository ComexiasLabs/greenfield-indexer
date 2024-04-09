import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_SEARCH_MODE } from '@core/const/constant';
import {
  apiFetchBucketById,
  apiFetchBucketByName,
  apiFetchBucketsByTags,
  apiSearchBuckets,
} from '@handlers/apiBucketServices';
import { apiSearchContent } from '@handlers/apiContentServices';
import { apiFetchObjectById, apiFetchObjectsByTags, apiSearchObjects } from '@handlers/apiObjectServices';

const resolvers = {
  Query: {
    findBucketsByTags: async (_, { tags, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET }) => {
      const result = await apiFetchBucketsByTags(tags, limit, offset);
      return {
        data: result.data,
        pagination: {
          offset,
          limit,
          totalCount: result.totalCount,
        },
      };
    },
    findObjectsByTags: async (_, { tags, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET }) => {
      const result = await apiFetchObjectsByTags(tags, limit, offset);
      return {
        data: result.data,
        pagination: {
          offset,
          limit,
          totalCount: result.totalCount,
        },
      };
    },
    findBucketById: async (_, { id }) => {
      return await apiFetchBucketById(id);
    },
    findBucketByName: async (_, { name }) => {
      return await apiFetchBucketByName(name);
    },
    findObjectById: async (_, { id }) => {
      return await apiFetchObjectById(id);
    },
    searchBuckets: async (
      _,
      { keyword, searchMode = DEFAULT_SEARCH_MODE, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET },
    ) => {
      const result = await apiSearchBuckets(keyword, searchMode, limit, offset);
      return {
        data: result.data,
        pagination: {
          offset,
          limit,
          totalCount: result.totalCount,
        },
      };
    },
    searchObjects: async (
      _,
      { keyword, searchMode = DEFAULT_SEARCH_MODE, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET },
    ) => {
      const result = await apiSearchObjects(keyword, searchMode, limit, offset);
      return {
        data: result.data,
        pagination: {
          offset,
          limit,
          totalCount: result.totalCount,
        },
      };
    },
    searchContent: async (
      _,
      { keyword, searchMode = DEFAULT_SEARCH_MODE, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET },
    ) => {
      const result = await apiSearchContent(keyword, searchMode, limit, offset);
      return {
        data: result.data,
        pagination: {
          offset,
          limit,
          totalCount: result.totalCount,
        },
      };
    },
  },
};

export default resolvers;
