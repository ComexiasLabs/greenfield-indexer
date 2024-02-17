# Greenfield Indexer - Collector Service

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

The following endpoint will index the first 100 buckets. Subsequent invokations will index the next 100 buckets, and so on.

```
curl --location --request POST 'https://greenfield-indexer-api.vercel.app/api/collect' --data ''
```

## API Documentation
The Greenfield Indexer provides a set of API endpoints to trigger the ingestion and indexing of buckets and objects within the BNB Chain's Greenfield. These operations are essential for keeping the off-chain database up-to-date with the latest data from Greenfield.

### Authentication
All API requests must be accompanied by an x-api-key header containing your API key. Unauthorized requests will be rejected.

```
Header: x-api-key: YourApiKeyHere
```

### Endpoints

#### Collect All
Trigger the ingestion and indexing process for both buckets and objects, starting from the last synchronization point.

- Method: POST
- URL: https://greenfield-indexer-api.vercel.app/api/collect
- Headers: x-api-key: Your API key

Example Request:

```
curl -X POST https://greenfield-indexer-api.vercel.app/api/collect \
-H "x-api-key: YourApiKeyHere"
```

#### Collect Buckets
Initiate the ingestion and indexing of buckets only, resuming from the last synchronization point.

- Method: POST
- URL: https://greenfield-indexer-api.vercel.app/api/collect/buckets
- Headers: x-api-key: Your API key

-Example Request:

```
curl -X POST https://greenfield-indexer-api.vercel.app/api/collect/buckets \
-H "x-api-key: YourApiKeyHere"
```

#### Collect Objects
Start the ingestion and indexing process for objects, picking up from the last synchronization point.

- Method: POST
- URL: https://greenfield-indexer-api.vercel.app/api/collect/objects
- Headers: x-api-key: Your API key

Example Request:

```
curl -X POST https://greenfield-indexer-api.vercel.app/api/collect/objects \
-H "x-api-key: YourApiKeyHere"
```
