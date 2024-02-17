import * as mongoDB from 'mongodb';
import { DBStorageBucket } from './models/dbStorageBucket.model';
import { DBStorageObject } from './models/dbStorageObject.model';
import { MongoDBStorageBuckets } from './collections/storageBuckets.collections';
import { MongoDBStorageObjects } from './collections/storageObjects.collections';
import { Config } from '@/core/config/config';
import { MongoDBSyncStatus } from './collections/syncStatus.collections';
import { DBSyncStatus } from './models/dbSyncStatus.model';

enum CollectionNames {
  StorageBuckets = 'buckets',
  StorageObjects = 'objects',
  SyncStatus = 'sync_status',
}

export class MongoDB {
  client!: mongoDB.MongoClient;
  connected: boolean = false;

  public collections: {
    storageBuckets?: MongoDBStorageBuckets;
    storageObjects?: MongoDBStorageObjects;
    syncStatus?: MongoDBSyncStatus;
  } = {};

  constructor() {}

  isConnected = () => this.connected;

  async connectToDatabase() {
    this.client = new mongoDB.MongoClient(Config.databaseConnection);
    await this.client.connect();
    this.connected = true;

    const db = this.client.db(Config.databaseName);

    // // Apply schema validation to the collection
    // await applySchemaValidation(db);

    this.collections.storageBuckets = new MongoDBStorageBuckets(
      db.collection<DBStorageBucket>(CollectionNames.StorageBuckets),
    );
    this.collections.storageObjects = new MongoDBStorageObjects(
      db.collection<DBStorageObject>(CollectionNames.StorageObjects),
    );
    this.collections.syncStatus = new MongoDBSyncStatus(
      db.collection<DBSyncStatus>(CollectionNames.SyncStatus),
    );

    // this.collections.storageBuckets.ensureIndexes();
    // this.collections.storageObjects.ensureIndexes();
    // this.collections.syncStatus.ensureIndexes();

    console.log(`Opened connection to database: ${db.databaseName}.`);
  }

  async disconnectFromDatabase() {
    this.client && this.client.close();
    this.connected = false;
    console.log(`Closed connection to database.`);
  }
}
