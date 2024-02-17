import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@core/const/constant";
import { apiFetchBucketsByTags } from "@handlers/apiBucketServices";
import { apiFetchObjectsByTags } from "@handlers/apiObjectServices";

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
  },
};

export default resolvers;
