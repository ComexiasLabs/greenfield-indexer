import * as mongoDB from 'mongodb';
import { DBStorageBucket } from './models/dbStorageBucket.model';
import { DBStorageObject } from './models/dbStorageObject.model';
import { MongoDBStorageBuckets } from './collections/storageBuckets.collections';
import { MongoDBStorageObjects } from './collections/storageObjects.collections';
import { Config } from '@/core/config/config';
import { MongoDBSyncStatus } from './collections/syncStatus.collections';
import { DBSyncStatus } from './models/dbSyncStatus.model';
import { Environments } from '@/core/types/environments';
import { MongoDBStorageContent } from './collections/storageContents.collections';
import { DBStorageContent } from './models/dbStorageContent.model';

enum CollectionNames {
  StorageBuckets = 'buckets',
  StorageObjects = 'objects',
  StorageContent = 'content',
  SyncStatus = 'sync_status',
}

export class MongoDB {
  client!: mongoDB.MongoClient;
  connected: boolean = false;

  public collections: {
    storageBuckets?: MongoDBStorageBuckets;
    storageObjects?: MongoDBStorageObjects;
    storageContent?: MongoDBStorageContent;
    syncStatus?: MongoDBSyncStatus;
  } = {};

  constructor() {}

  isConnected = () => this.connected;

  async connectToDatabase(env: Environments) {
    this.client = new mongoDB.MongoClient(Config.databaseConnection);
    await this.client.connect();
    this.connected = true;

    const db = this.client.db(env === 'Mainnet' ? Config.databaseNameMainnet : Config.databaseNameTestnet);

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

    await this.collections.storageBuckets.ensureIndexes();
    await this.collections.storageObjects.ensureIndexes();
    await this.collections.storageContent.ensureIndexes();
    await this.collections.syncStatus.ensureIndexes();

    console.log(`Opened connection to database: ${db.databaseName}.`);
  }

  async disconnectFromDatabase() {
    this.client && this.client.close();
    this.connected = false;
    console.log(`Closed connection to database.`);
  }
}
