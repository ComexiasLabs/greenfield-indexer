import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    findBucketsByTags(tags: [TagInput!]!, limit: Int, offset: Int): BucketsResult
    findObjectsByTags(tags: [TagInput!]!, limit: Int, offset: Int): ObjectsResult
    findBucketById(id: Int!): StorageBucket
    findObjectById(id: Int!): StorageObject
    findBucketByName(name: String!): StorageBucket
    searchBuckets(keyword: String!, searchMode: String, limit: Int, offset: Int): BucketsResult
    searchObjects(keyword: String!, searchMode: String, limit: Int, offset: Int): ObjectsResult
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

  type BucketsResult {
    data: [StorageBucket]
    pagination: PaginationInfo
  }

  type ObjectsResult {
    data: [StorageObject]
    pagination: PaginationInfo
  }
`;
