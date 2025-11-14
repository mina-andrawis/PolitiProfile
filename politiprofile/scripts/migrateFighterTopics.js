// Migration script to add topicPositions field to existing fighters
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Topics list - copied from helpers/topics.js (top 15)
const topics = [
  { name: "Health" },
  { name: "Government Operations and Politics" },
  { name: "Armed Forces and National Security" },
  { name: "International Affairs" },
  { name: "Taxation" },
  { name: "Crime and Law Enforcement" },
  { name: "Agriculture and Food" },
  { name: "Finance and Financial Sector" },
  { name: "Education" },
  { name: "Public Lands and Natural Resources" },
  { name: "Transportation and Public Works" },
  { name: "Immigration" },
  { name: "Commerce" },
  { name: "Energy" },
  { name: "Labor and Employment" }
];

const uri = process.env.MONGO_URI;

async function migrateFighters() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db("default");
    const collection = database.collection("fighters");

    // Initialize topicPositions object with all topics set to no-position
    const defaultTopicPositions = {};
    topics.forEach(topic => {
      defaultTopicPositions[topic.name] = {
        stance: "no-position",
        priority: "low"
      };
    });

    // Update all fighters that don't have topicPositions field
    const result = await collection.updateMany(
      { topicPositions: { $exists: false } },
      {
        $set: {
          topicPositions: defaultTopicPositions
        }
      }
    );

    console.log(`\n✅ Migration complete!`);
    console.log(`Updated ${result.modifiedCount} fighters with topicPositions field`);
    console.log(`Matched ${result.matchedCount} fighters without the field`);

    // Show sample fighter
    const sampleFighter = await collection.findOne({ topicPositions: { $exists: true } });
    if (sampleFighter) {
      console.log(`\nSample fighter topicPositions:`);
      console.log(JSON.stringify(sampleFighter.topicPositions, null, 2));
    }

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await client.close();
  }
}

migrateFighters();
