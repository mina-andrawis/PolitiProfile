import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { policyArea } = req.query;

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("bills");

      const query = {};
      if (policyArea) {
        query.policyArea = policyArea;
      }


      const bills = await collection.find(query).toArray();

      if (bills.length === 0) {
        res.status(404).json({ error: "No bills found for the specified filter" });
      } else {
        res.status(200).json({ bills });
      }
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
