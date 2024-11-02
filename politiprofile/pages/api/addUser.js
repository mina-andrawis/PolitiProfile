// Example MongoDB insert logic in an API route or server-side function

import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, email } = req.body; // Expecting user data, including `user.uid`

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("users");

      const doc = {
        _id: uid,
        email: email,
        name: "",
        topics: [],
        role: "user",
      };

      const result = await collection.insertOne(doc);
      console.log(`User document created with custom _id: ${result.insertedId}`);
      res.status(200).json({ message: `User created with ID: ${result.insertedId}` });
    } catch (e) {
      if (e.code === 11000) { // Duplicate key error
        console.error("A user with this ID already exists.");
        res.status(409).json({ error: "User already exists." });
      } else {
        console.error("Error inserting document:", e);
        res.status(500).json({ error: "Unable to add user to MongoDB" });
      }
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
