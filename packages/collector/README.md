# Greenfield Indexer - Collector Service

## References

Reference API Doc: https://greenfield.bnbchain.org/openapi

## Getting Started

### Setup Collector

1. **Clone the repository and install dependencies**

```bash
git clone https://github.com/jnlewis/greenfield-indexer.git
cd greenfield-indexer/packages/collector
yarn
```

2. **Configure environment variables**

Copy the .env.example file to .env and fill in your MongoDB Connection and any other relevant configurations.

```
cp .env.example .env
```

3. **Start the service**

```
yarn dev

or

yarn build && yarn start
```

4. **Collect and Index data**

```
chmod +x scripts/bulk-index-buckets.sh
chmod +x scripts/bulk-index-objects.sh
chmod +x scripts/bulk-index-content.sh

./scripts/bulk-index-buckets.sh mainnet
./scripts/bulk-index-buckets.sh testnet

./scripts/bulk-index-objects.sh mainnet
./scripts/bulk-index-objects.sh testnet

./scripts/bulk-index-content.sh mainnet
./scripts/bulk-index-content.sh testnet
```

## Collector System

### Database Tables

- buckets
- objects
- content
- sync_status

### Indexing Stages

```
export enum BucketIndexStatuses {
  PendingBucketSync = 'PendingBucketSync',
  PendingObjectsSync = 'PendingObjectsSync',
  SyncComplete = 'SyncComplete',
  BucketFetchFailed = 'BucketFetchFailed',
  ObjectsFetchFailed = 'ObjectsFetchFailed',
}

export enum ObjectIndexStatuses {
  PendingContentSync = 'PendingContentSync',
  SyncComplete = 'SyncComplete',
  ContentFetchFailed = 'ContentFailedFetch',
}
```

### Scheduler

The scheduler for the collection on server is configured to the following:

Mainnet:
```
{
  "crons": [
    {
      "path": "/api/collect/tx?env=mainnet",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/collect/meta?env=mainnet",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/collect/content?env=mainnet",
      "schedule": "* * * * *"
    }
  ]
}
```

Testnet:
```
{
  "crons": [
    {
      "path": "/api/collect/tx?env=testnet",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/collect/meta?env=testnet",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/collect/content?env=testnet",
      "schedule": "* * * * *"
    }
  ]
}
```

## Collector API Documentation

The Greenfield Indexer provides a set of collector API endpoints to trigger the ingestion and indexing of buckets and objects within the BNB Chain's Greenfield. These operations are intended to keep the off-chain database up-to-date with the latest data from Greenfield.

### Authentication

All API requests must be accompanied by an x-api-key header containing your API key. Unauthorized requests will be rejected.

```
Header: x-api-key: YourApiKeyHere
```

### Endpoints

#### Collect All

Trigger the ingestion and indexing process for both buckets and objects, starting from the last synchronization point.

Sequence of actions:
- Fetch transactions from last indexed block
- 

This will first crawl Transactions, then followed by the bucket and objects based on the transaction, finally the content for each bucket.

- Method: GET
- URL: https://www.greenfieldindexer.com/api/collect
- Headers: x-api-key: Your API key

Example Request:

```
curl -X GET https://www.greenfieldindexer.com/api/collect \
-H "x-api-key: YourApiKeyHere"
```

#### Collect Buckets (Bulk Collection)

Initiate the ingestion and indexing of buckets only, resuming from the last synchronization point based on last indexed paginationKey.

- Method: GET
- URL: https://www.greenfieldindexer.com/api/collect/buckets
- Headers: x-api-key: Your API key

-Example Request:

```
curl -X GET https://www.greenfieldindexer.com/api/collect/buckets \
-H "x-api-key: YourApiKeyHere"
```

#### Collect Objects (Bulk Collection)

Start the ingestion and indexing process for objects, picking up from the last synchronization point.

- Method: GET
- URL: https://www.greenfieldindexer.com/api/collect/objects
- Headers: x-api-key: Your API key

Example Request:

```
curl -X GET https://www.greenfieldindexer.com/api/collect/objects \
-H "x-api-key: YourApiKeyHere"
```
