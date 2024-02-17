import * as mongoDB from 'mongodb';
import { Config } from '@core/config/config';
import DBStorageBucket from './models/dbStorageBucket.model';
import DBStorageObject from './models/dbStorageObject.model';
import { MongoDBStorageBuckets } from './collections/storageBuckets.collections';
import { MongoDBStorageObjects } from './collections/storageObjects.collections';

enum CollectionNames {
  StorageBuckets = 'buckets',
  StorageObjects = 'objects',
}

export class MongoDB {
  client: mongoDB.MongoClient;

  public collections: {
    storageBuckets?: MongoDBStorageBuckets;
    storageObjects?: MongoDBStorageObjects;
  } = {};

  constructor() {}

  async connectToDatabase() {
    this.client = new mongoDB.MongoClient(Config.databaseConnection);
    await this.client.connect();

    const db = this.client.db(Config.databaseName);

    // // Apply schema validation to the collection
    // await applySchemaValidation(db);

    this.collections.storageBuckets = new MongoDBStorageBuckets(
      db.collection<DBStorageBucket>(CollectionNames.StorageBuckets),
    );
    this.collections.storageObjects = new MongoDBStorageObjects(
      db.collection<DBStorageObject>(CollectionNames.StorageObjects),
    );

    console.log(`Successfully connected to database: ${db.databaseName}`);
  }

  async disconnectFromDatabase() {
    this.client.close();
  }
}
