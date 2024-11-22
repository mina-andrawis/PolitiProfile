import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { billId, policyArea, page = 1, limit = 30 } = req.query; // Added `billId` to query parameters

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("bills");

      const query = {};
      // If billId is provided, prioritize that
      if (billId) {
        query.billId = billId;
      } else if (policyArea) {
        query.policyArea = policyArea;
      }

      if (billId) {
        // Fetch a single document when billId is provided
        const bill = await collection.findOne(query);
        if (!bill) {
          return res.status(404).json({ message: "Bill not found" });
        }
        return res.status(200).json({ bill });
      }

      // Fetch multiple bills with pagination when filtering by policyArea
      const skip = (page - 1) * limit;
      const bills = await collection.find(query).skip(skip).limit(Number(limit)).toArray();
      const totalBills = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalBills / limit);

      return res.status(200).json({ bills, totalBills, totalPages });
    } catch (e) {
      console.error("Error fetching bills:", e);
      res.status(500).json({ error: 'Unable to get bills from MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
