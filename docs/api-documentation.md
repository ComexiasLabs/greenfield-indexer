# Greenfield Indexer API

Greenfield Indexer API is a facilitates the searching of buckets and objects on BNB Chain's Greenfield. It provides two distinct APIs: a RESTful API for HTTP request-based interactions and a GraphQL API for flexible queries.

## Postman Collection

The Postman collection for all GraphQL and REST API queries are available to download at [greenfield-indexer-api.postman_collection.json](/postman/greenfield-indexer-api.postman_collection.json)

## GraphQL API

The GraphQL API offers a flexible way to query the BNB Greenfield buckets and objects metadata using GraphQL queries.

The GraphQL API is accessible at:

**Mainnet**
```bash
https://greenfield-indexer-api.vercel.app/api/graphql
```

**Testnet**
```bash
https://greenfield-indexer-api-testnet.vercel.app/api/graphql
```

All queries and mutations must be sent as POST requests to this endpoint.

### findBucketsByTags

Fetches buckets by tags, with optional pagination.

```graphql
query findBucketsByTags($tags: [TagInput!]!, $limit: Int, $offset: Int) {
  findBucketsByTags(tags: $tags, limit: $limit, offset: $offset) {
    data {
      id
      name
      tags {
        key
        value
      }
    }
    pagination {
      offset
      limit
      totalCount
    }
  }
}
```

Example:

```bash
curl -X POST -H "Content-Type: application/json" \
--data '{ "query": "{ findBucketsByTags(tags: [{key: \"visibility\", value: \"VISIBILITY_TYPE_PUBLIC_READ\"}], limit: 10, offset: 0) { data { id name tags { key value } } pagination { offset limit totalCount } } }" }' \
greenfield-indexer-api.vercel.app/api/graphql

```

### findObjectsByTags

Retrieves objects by tags, with optional pagination.

```graphql
query findObjectsByTags($tags: [TagInput!]!, $limit: Int, $offset: Int) {
  findObjectsByTags(tags: $tags, limit: $limit, offset: $offset) {
    data {
      id
      bucketName
      name
      contentType
      tags {
        key
        value
      }
    }
    pagination {
      offset
      limit
      totalCount
    }
  }
}
```

Example:

```bash
curl -X POST -H "Content-Type: application/json" \
--data '{ "query": "{ findObjectsByTags(tags: [{key: \"contentType\", value: \"text/plain\"}], limit: 10, offset: 0) { data { id bucketName name contentType tags { key value } } pagination { offset limit totalCount } } }" }' \
greenfield-indexer-api.vercel.app/api/graphql
```

### findBucketById

Fetches a bucket by its Id.

```graphql
query findBucketById($id: Int!) {
  findBucketById(id: $id) {
    id
    name
    tags {
      key
      value
    }
  }
}
```

Example:

```bash
curl -X POST -H "Content-Type: application/json" \
--data '{ "query": "{ findBucketById(id: 7237) { id name tags { key value } } }" }' \
greenfield-indexer-api.vercel.app/api/graphql

```

### findObjectById

Fetches an object by its Id.

```graphql
query findObjectById($id: Int!) {
  findObjectById(id: $id) {
    id
    name
    tags {
      key
      value
    }
  }
}
```

Example:

```bash
curl -X POST -H "Content-Type: application/json" \
--data '{ "query": "{ findObjectById(id: 5355) { id name tags { key value } } }" }' \
greenfield-indexer-api.vercel.app/api/graphql

```

### Types

- **TagInput**: Input type for specifying tags as key-value pairs.
- **Bucket**: Represents a bucket, including its id, name, and tags.
- **StorageObject**: Represents an object, including its id, bucket name, name, contentType, and tags.
- **PaginationInfo**: Contains pagination details such as offset, limit, and total count.

## RESTful API

The RESTful API allows for straightforward access to Greenfield data, supporting operations like finding buckets and objects by tags.

The RESTful API is accessible at:

**Mainnet**
```bash
https://greenfield-indexer-api.vercel.app/api
```

**Testnet**
```bash
https://greenfield-indexer-api-testnet.vercel.app/api
```

### Find Bucket by Id

Fetches a bucket by its Id.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/buckets/{id}>

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/buckets/7237"
```

### Find Object by Id

Fetches a object by its Id.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/objects/{id}>

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/objects/5355"
```

### Find Buckets by Tags

Fetches buckets by tags keys and values.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/buckets>
- Query params:
  - tags: A JSON array of objects specifying key and value pairs. Each object should have a key and a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/buckets?tags=[{\"key\":\"visibility\", \"value\":\"VISIBILITY_TYPE_PUBLIC_READ\"}]&limit=10&offset=0"
```

### Find Buckets by Tag Keys

Fetches buckets by tags keys.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/buckets>
- Query params:
  - tags: A JSON array of objects specifying key. Each object should have a key property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.
    Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/buckets?tags=[{\"key\":\"visibility\"}]&limit=10&offset=0"
```

### Find Buckets by Tag Values

Fetches buckets by tags values.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/buckets>
- Query params:
  - tags: A JSON array of objects specifying value. Each object should have a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/buckets?tags=[{\"value\":\"VISIBILITY_TYPE_PUBLIC_READ\"}]&limit=10&offset=0"
```

### Find Objects by Tags

Fetches objects by tags keys and values.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/objects>
- Query params:
  - tags: A JSON array of objects specifying key and value pairs. Each object should have a key and a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/objects?tags=[{\"key\":\"contentType\", \"value\":\"text/plain\"}]&limit=10&offset=0"
```

### Find Objects by Key

Fetches objects by tags keys.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/objects>
- Query params:
  - tags: A JSON array of objects specifying key. Each object should have a key property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/objects?tags=[{\"key\":\"contentType\"}]&limit=10&offset=0"
```

### Find Objects by Value

Fetches objects by tags values.

- Method: GET
- URL: <http://greenfield-indexer-api.vercel.app/api/find/objects>
- Query params:
  - tags: A JSON array of objects specifying value. Each object should have a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://greenfield-indexer-api.vercel.app/api/find/objects?tags=[{\"value\":\"text/plain\"}]&limit=10&offset=0"
```
