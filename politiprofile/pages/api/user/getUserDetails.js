import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { _id } = req.body;

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("users");

      // Query by _id directly as a string
      const user = await collection.findOne({ _id: _id });
    
      if (!user) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json({ user });
        console.log("User found:", user);
      }
    } catch (e) {
      console.error("Error fetching user:", e);
      res.status(500).json({ error: 'Unable to get user in MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
