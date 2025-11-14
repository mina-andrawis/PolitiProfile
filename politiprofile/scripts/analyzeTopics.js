// Script to analyze bills collection and find top 15 most popular policyArea topics
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGO_URI;

async function analyzeTopics() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db("default");
    const collection = database.collection("bills");

    // Aggregate to count bills by policyArea
    const topicCounts = await collection.aggregate([
      {
        $match: {
          policyArea: { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$policyArea",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20 // Get top 20 to see the distribution
      }
    ]).toArray();

    console.log('\n=== TOP 20 POLICY AREAS BY BILL COUNT ===\n');
    topicCounts.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic._id}: ${topic.count} bills`);
    });

    console.log('\n=== TOP 15 FOR IMPLEMENTATION ===\n');
    const top15 = topicCounts.slice(0, 15);
    console.log(JSON.stringify(top15.map(t => t._id), null, 2));

    // Get total bills count
    const totalBills = await collection.countDocuments({});
    const billsWithPolicyArea = await collection.countDocuments({
      policyArea: { $exists: true, $ne: null, $ne: "" }
    });

    console.log(`\n=== STATISTICS ===`);
    console.log(`Total bills: ${totalBills}`);
    console.log(`Bills with policyArea: ${billsWithPolicyArea}`);
    console.log(`Coverage of top 15: ${top15.reduce((sum, t) => sum + t.count, 0)} bills (${((top15.reduce((sum, t) => sum + t.count, 0) / billsWithPolicyArea) * 100).toFixed(1)}%)`);

  } catch (error) {
    console.error('Error analyzing topics:', error);
  } finally {
    await client.close();
  }
}

analyzeTopics();
