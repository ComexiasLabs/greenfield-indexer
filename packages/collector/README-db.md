# MongoDB CLI Commands (MongoSH)

## Connecting to Server

### 1. Connecting to a MongoDB Server

Connect to Local Database:

```
mongosh "mongodb://localhost:27017/"
```

Connect to Server Database:

```
mongosh "mongodb://dbuser:*****@54.173.66.247:27017/"
```

## Opening and Querying Database

### 2. List All Databases on the Server

Run the following command after connecting:

```
show dbs
```

### 3. Select a Database

To switch to a specific database:

```
use greenfield_indexer_mainnet
use greenfield_indexer_testnet
```

### 7. List Collections in a Database

After selecting a database:

```
show collections
```

### 15. Basic Querying

To view documents in a collection:

```
db.buckets.find()
```

Find specific documents:

```
db.buckets.find({name: "Alice"})
```

Count documents:

```
db.buckets.countDocuments()
```

### Check Database Stats

To view database statistics:

```
db.stats()
```

## Backup, Restore, Rename

### Backup a Database (Also used for renaming)

Use mongodump to back up a database:

```
## NOTE: This will dump all database to dump folder
mongodump
```

or

```
mongodump --uri="mongodb://localhost:27017/greenfield_indexer_mainnet" --out=/dump/greenfield_indexer_mainnet
```

### Restore a Database

Use mongorestore to restore a database: Local

```
mongorestore --uri="mongodb://localhost:27017" --db=greenfield_indexer_mainnet_bk --drop dump/greenfield_indexer_mainnet

mongorestore --uri="mongodb://localhost:27017" --db=greenfield_indexer_testnet_bk --drop dump/greenfield_indexer_testnet
```

### Delete Collections

```
use greenfield_indexer_mainnet;
db.getCollectionNames().forEach(collection => db[collection].drop());
```

### Drop a Database

To drop a database:

```
db.dropDatabase()
```

## JSON/CSV Export

### 13. Export Data to JSON/CSV

Use mongoexport:

```
mongoexport --uri="mongodb://<host>:<port>" --db=<databaseName> --collection=<collectionName> --out=<outputFile>
```

Example:

```
mongoexport --uri="mongodb://localhost:27017" --db=test --collection=users --out=users.json
```

### 14. Import Data from JSON/CSV

Use mongoimport:

```
mongoimport --uri="mongodb://<host>:<port>" --db=<databaseName> --collection=<collectionName> --file=<inputFile>
```

Example:

```
mongoimport --uri="mongodb://localhost:27017" --db=test --collection=users --file=users.json
```
