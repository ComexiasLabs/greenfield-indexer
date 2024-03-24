
const { MongoClient } = require('mongodb');

async function migrate() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("greenfield_indexer_testnet");

    // Create new field 'indexStatus' in Bucket document and default to SyncComplete
    let buckets = database.collection("buckets");
    const bucketsResult = await buckets.updateMany(
      {}, 
      { $set: { indexStatus: "SyncComplete" } }
    );

    console.log(bucketsResult.modifiedCount + " documents were updated.");

    // Rename status in sync_status table for Bucket and Object to BulkBucket and BulkObject
    let sync_status = database.collection("sync_status");
    const sync_statusResult1 = await sync_status.updateMany(
      { channel: "Bucket" }, 
      { $set: { channel: "BulkBucket" } }
    );
    const sync_statusResult2 = await sync_status.updateMany(
      { channel: "Object" }, 
      { $set: { channel: "BulkObject" } }
    );

    console.log(sync_statusResult1.modifiedCount + " documents were updated.");
    console.log(sync_statusResult2.modifiedCount + " documents were updated.");
    
  } finally {
    await client.close();
  }
}

migrate().catch(console.error);
