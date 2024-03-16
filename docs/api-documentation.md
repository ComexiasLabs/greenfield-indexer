# Greenfield Indexer API

Greenfield Indexer API is a facilitates the searching of buckets and objects on BNB Chain's Greenfield. It provides two distinct APIs: a RESTful API for HTTP request-based interactions and a GraphQL API for flexible queries.

## Postman Collection

The Postman collection for all GraphQL and REST API queries are available to download at [greenfield-indexer-api.postman_collection.json](/postman/greenfield-indexer-api.postman_collection.json)

## GraphQL API

The GraphQL API offers a flexible way to query the BNB Greenfield buckets and objects metadata using GraphQL queries.

The GraphQL API is accessible at:

**Mainnet**
```bash
https://www.greenfieldindexer.com/api/graphql
```

**Testnet**
```bash
https://testnet.greenfieldindexer.com/api/graphql
```

All queries and mutations must be sent as POST requests to this endpoint.

### Find Buckets

#### findBucketsByTags

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
www.greenfieldindexer.com/api/graphql

```

#### findBucketById

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
www.greenfieldindexer.com/api/graphql

```

#### findBucketByName

Fetches a bucket by its name.

```graphql
query findBucketByName($name: String!) {
  findBucketByName(name: $name) {
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
--data '{ "query": "{ findBucketByName(id: "public") { id name tags { key value } } }" }' \
www.greenfieldindexer.com/api/graphql

```

### Find Objects

#### findObjectsByTags

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
www.greenfieldindexer.com/api/graphql
```

#### findObjectById

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
www.greenfieldindexer.com/api/graphql

```

### Search Buckets

#### searchBuckets

Search buckets by keyword, with optional pagination.

Parameters:
- Use searchMode = "word" to search the keyword by full word.
- Use searchMode = "partial" to search the keyword by partial text.

```graphql
query searchBuckets($keyword: String!, searchMode: String, $limit: Int, $offset: Int) {
  searchBuckets(keyword: $keyword, searchMode: $searchMode, limit: $limit, offset: $offset) {
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
curl --location 'https://www.greenfieldindexer.com/api/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"query {\n  searchBuckets(keyword: \"greendrive\", searchMode: \"Word\", limit: 10, offset: 0) {\n    data {\n      id\n      name\n      tags {\n        key\n        value\n      }\n    }\n    pagination {\n      offset\n      limit\n      totalCount\n    }\n  }\n}\n","variables":{}}'
```

### Search Objects

#### searchBuckets

Search objects by keyword, with optional pagination.

Parameters:
- Use searchMode = "word" to search the keyword by full word.
- Use searchMode = "partial" to search the keyword by partial text.

```graphql
query searchObjects($keyword: String!, searchMode: String, $limit: Int, $offset: Int) {
  searchObjects(keyword: $keyword, searchMode: $searchMode, limit: $limit, offset: $offset) {
    data {
      id
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
curl --location 'https://www.greenfieldindexer.com/api/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"query {\n  searchBuckets(keyword: \"greendrive\", searchMode: \"Word\", limit: 10, offset: 0) {\n    data {\n      id\n      name\n      tags {\n        key\n        value\n      }\n    }\n    pagination {\n      offset\n      limit\n      totalCount\n    }\n  }\n}\n","variables":{}}'
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
https://www.greenfieldindexer.com/api
```

**Testnet**
```bash
https://testnet.greenfieldindexer.com/api
```

### Find Buckets

#### Find Bucket by Id

Fetches a bucket by its Id.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/buckets/{id}>

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/buckets/7237"
```

#### Find Bucket by Name

Fetches a bucket by its name.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/buckets/name/{bucketName}>

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/buckets/name/public"
```

#### Find Buckets by Tags

Fetches buckets by tags keys and values.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/buckets>
- Query params:
  - tags: A JSON array of objects specifying key and value pairs. Each object should have a key and a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/buckets?tags=[{\"key\":\"visibility\", \"value\":\"VISIBILITY_TYPE_PUBLIC_READ\"}]&limit=10&offset=0"
```

#### Find Buckets by Tag Keys

Fetches buckets by tags keys.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/buckets>
- Query params:
  - tags: A JSON array of objects specifying key. Each object should have a key property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.
    Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/buckets?tags=[{\"key\":\"visibility\"}]&limit=10&offset=0"
```

#### Find Buckets by Tag Values

Fetches buckets by tags values.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/buckets>
- Query params:
  - tags: A JSON array of objects specifying value. Each object should have a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/buckets?tags=[{\"value\":\"VISIBILITY_TYPE_PUBLIC_READ\"}]&limit=10&offset=0"
```

### Find Objects

#### Find Object by Id

Fetches a object by its Id.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/objects/{id}>

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/objects/5355"
```

#### Find Objects by Tags

Fetches objects by tags keys and values.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/objects>
- Query params:
  - tags: A JSON array of objects specifying key and value pairs. Each object should have a key and a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/objects?tags=[{\"key\":\"contentType\", \"value\":\"text/plain\"}]&limit=10&offset=0"
```

#### Find Objects by Key

Fetches objects by tags keys.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/objects>
- Query params:
  - tags: A JSON array of objects specifying key. Each object should have a key property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/objects?tags=[{\"key\":\"contentType\"}]&limit=10&offset=0"
```

#### Find Objects by Value

Fetches objects by tags values.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/find/objects>
- Query params:
  - tags: A JSON array of objects specifying value. Each object should have a value property.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/find/objects?tags=[{\"value\":\"text/plain\"}]&limit=10&offset=0"
```

### Search Buckets

Search buckets by keyword, with optional pagination.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/search/buckets>
- Query params:
  - keyword: Keyword to search.
  - searchMode:
    - "word" to search the keyword by full word.
    - "partial" to search the keyword by partial text.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/search/buckets?keyword=green&searchMode=word&offset=0&limit=10
```

### Search Objects

Search objects by keyword, with optional pagination.

- Method: GET
- URL: <http://www.greenfieldindexer.com/api/search/objects>
- Query params:
  - keyword: Keyword to search.
  - searchMode:
    - "word" to search the keyword by full word.
    - "partial" to search the keyword by partial text.
  - limit (optional): The maximum number of results to return.
  - offset (optional): The number of items to skip before starting to collect the result set.

Example Request:

```bash
curl "http://www.greenfieldindexer.com/api/search/objects?keyword=green&searchMode=word&offset=0&limit=10
```
