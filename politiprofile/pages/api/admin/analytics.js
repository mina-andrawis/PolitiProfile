import { MongoClient } from 'mongodb';
import { verifyAdminAccess } from '../../../helpers/adminAuth';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify admin access
  const isAdmin = await verifyAdminAccess(req);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  try {
    await client.connect();
    const database = client.db("default");

    // Top user topics
    const topUserTopics = await database.collection("users").aggregate([
      { $unwind: "$topics" },
      { $group: { _id: "$topics", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { topic: "$_id", count: 1, _id: 0 } }
    ]).toArray();

    // Position coverage
    const totalFighters = await database.collection("fighters").countDocuments();
    const withPositions = await database.collection("fighters").countDocuments({
      topicPositions: { $exists: true, $ne: {} }
    });
    const withoutPositions = totalFighters - withPositions;
    const percentage = totalFighters > 0 ? Math.round((withPositions / totalFighters) * 100) : 0;

    return res.status(200).json({
      topUserTopics,
      positionCoverage: {
        withPositions,
        withoutPositions,
        percentage
      }
    });

  } catch (e) {
    console.error("Error fetching analytics:", e);
    return res.status(500).json({
      error: 'Unable to fetch analytics',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
