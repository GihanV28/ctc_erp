// test-connection.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://cct-admin:tqXsDgQzWu0imDYe@cct-cluster.rwkaked.mongodb.net/?appName=CCT-Cluster";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB Atlas!");

    const database = client.db('ceylon-cargo-transport');
    const collections = await database.listCollections().toArray();
    console.log("📁 Collections:", collections);

  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();