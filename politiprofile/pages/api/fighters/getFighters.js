import { MongoClient } from 'mongodb';
import { calculateAlignment } from '../../../helpers/alignmentScore';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { state, page = 1, limit = 30, userTopics, sortBy = 'alignment' } = req.query;

  // Parse userTopics if it's a JSON string
  let parsedUserTopics = [];
  if (userTopics) {
    try {
      parsedUserTopics = typeof userTopics === 'string' ? JSON.parse(userTopics) : userTopics;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid userTopics format. Must be JSON array.' });
    }
  }

  try {
    await client.connect();
    const database = client.db("default");
    const collection = database.collection("fighters");

    const query = {};
    if (state) {
      query.state = state;
    }

    // Fetch fighters with pagination
    const skip = (page - 1) * limit;
    let fighters = await collection.find(query).skip(skip).limit(Number(limit)).toArray();
    const totalFighters = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalFighters / limit);

    // Calculate alignment scores if userTopics provided
    if (parsedUserTopics.length > 0) {
      fighters = fighters.map(fighter => ({
        ...fighter,
        alignmentScore: calculateAlignment(parsedUserTopics, fighter.topicPositions || {})
      }));

      // Sort by alignment score if requested
      if (sortBy === 'alignment') {
        fighters.sort((a, b) => (b.alignmentScore || 0) - (a.alignmentScore || 0));
      }
    }

    return res.status(200).json({ fighters, totalFighters, totalPages });
  } catch (e) {
    console.error("Error fetching fighters:", e);
    return res.status(500).json({
      error: 'Unable to get fighters from MongoDB',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
