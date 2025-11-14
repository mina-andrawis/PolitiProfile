import { MongoClient } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { uid, email } = req.body;

  // Validate required fields
  if (!uid || !email) {
    return res.status(400).json({ error: "Missing required fields: uid and email" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

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
      Following: [],
    };

    const result = await collection.insertOne(doc);
    console.log(`User document created with custom _id: ${result.insertedId}`);
    return res.status(201).json({
      message: `User created with ID: ${result.insertedId}`,
      user: doc
    });
  } catch (e) {
    if (e.code === 11000) {
      console.error("A user with this ID already exists.");
      return res.status(409).json({ error: "User already exists." });
    } else {
      console.error("Error inserting document:", e);
      return res.status(500).json({
        error: "Unable to add user to MongoDB",
        details: process.env.NODE_ENV === 'development' ? e.message : undefined
      });
    }
  } finally {
    await client.close();
  }
}