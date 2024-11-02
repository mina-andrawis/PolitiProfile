// pages/api/addUser.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("users");

      // Extract name, content, and topics array from req.body
      const { name, email, topics, role, uid } = req.body;

      // Insert the document, including the topics array
      const doc = {
        name: name || "",
        email: email || "",
        topics: Array.isArray(topics) ? topics : [], // Ensure topics is an array
        role: role || "user",
        uid: uid || "",
      };

      const result = await collection.insertOne(doc);
      console.log(result.insertedId);
      res.status(200).json({ message: `New Firebase user created with ID: ${result.insertedId}` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Unable to add data to MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
