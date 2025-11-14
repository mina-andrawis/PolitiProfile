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

    // Get counts
    const totalFighters = await database.collection("fighters").countDocuments();
    const fightersWithPositions = await database.collection("fighters").countDocuments({
      topicPositions: { $exists: true, $ne: {} }
    });
    const totalUsers = await database.collection("users").countDocuments();
    const totalBills = await database.collection("bills").countDocuments();

    return res.status(200).json({
      totalFighters,
      fightersWithPositions,
      totalUsers,
      totalBills
    });

  } catch (e) {
    console.error("Error fetching stats:", e);
    return res.status(500).json({
      error: 'Unable to fetch stats',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
