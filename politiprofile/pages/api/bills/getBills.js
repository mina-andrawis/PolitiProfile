// pages/api/bills/getBills.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { policyArea, page = 1, limit = 50 } = req.query; // Default to page 1, limit 50

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("bills");

      const query = {};
      if (policyArea) {
        query.policyArea = policyArea;
      }

      const skip = (page - 1) * limit;
      const bills = await collection.find(query).skip(skip).limit(Number(limit)).toArray();

      const totalBills = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalBills / limit);

      res.status(200).json({ bills, totalBills, totalPages });
    } catch (e) {
      console.error("Error fetching bills:", e);
      res.status(500).json({ error: 'Unable to get bills in MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
