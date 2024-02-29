import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@core/const/constant";
import { apiFetchBucketById, apiFetchBucketByName, apiFetchBucketsByTags } from "@handlers/apiBucketServices";
import { apiFetchObjectById, apiFetchObjectsByTags } from "@handlers/apiObjectServices";

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
  },
};

export default resolvers;
