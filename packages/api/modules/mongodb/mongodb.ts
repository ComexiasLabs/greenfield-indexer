import * as mongoDB from 'mongodb';
import { Config } from '@core/config/config';
import { DBStorageBucket } from './models/dbStorageBucket.model';
import { DBStorageObject } from './models/dbStorageObject.model';
import { DBSyncStatus } from './models/dbSyncStatus.model';
import { MongoDBSyncStatus } from './collections/syncStatus.collections';
import { MongoDBStorageBuckets } from './collections/storageBuckets.collections';
import { MongoDBStorageObjects } from './collections/storageObjects.collections';
import { MongoDBStorageContent } from './collections/storageContents.collections';
import { DBStorageContent } from './models/dbStorageContent.model';

enum CollectionNames {
  StorageBuckets = 'buckets',
  StorageObjects = 'objects',
  StorageContent = 'content',
  SyncStatus = 'sync_status',
}

export class MongoDB {
  client: mongoDB.MongoClient;

  public collections: {
    storageBuckets?: MongoDBStorageBuckets;
    storageObjects?: MongoDBStorageObjects;
    storageContent?: MongoDBStorageContent;
    syncStatus?: MongoDBSyncStatus;
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
    this.collections.storageContent = new MongoDBStorageContent(
      db.collection<DBStorageContent>(CollectionNames.StorageContent),
    );
    this.collections.syncStatus = new MongoDBSyncStatus(db.collection<DBSyncStatus>(CollectionNames.SyncStatus));

    console.log(`Successfully connected to database: ${db.databaseName}`);
  }

  async disconnectFromDatabase() {
    this.client.close();
  }
}
