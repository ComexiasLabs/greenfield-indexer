import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    findBucketsByTags(tags: [TagInput!]!, limit: Int, offset: Int): BucketResult
    findObjectsByTags(tags: [TagInput!]!, limit: Int, offset: Int): ObjectResult
  }

  input TagInput {
    key: String
    value: String
  }

  type StorageBucket {
    id: Int
    name: String
    tags: [Tag]
  }

  type StorageObject {
    id: Int
    bucketName: String
    name: String
    contentType: String
    tags: [Tag]
  }

  type Tag {
    key: String
    value: String
  }

  type PaginationInfo {
    offset: Int
    limit: Int
    totalCount: Int
  }

  type BucketResult {
    data: [StorageBucket]
    pagination: PaginationInfo
  }

  type ObjectResult {
    data: [StorageObject]
    pagination: PaginationInfo
  }
`;
