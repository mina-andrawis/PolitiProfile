import { MongoClient } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const uri = process.env.MONGO_URI;
let client = null;
let clientPromise = null;

if (!client) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { _id } = req.body;
  
  if (!_id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  try {
    console.log('Attempting to fetch user with ID:', _id);
    
    // Use existing connection or create new one
    if (!client.topology || !client.topology.isConnected()) {
      client = await clientPromise;
    }
    
    const database = client.db("default");
    const collection = database.collection("users");

    // Query by _id directly as a string since Firebase auth UIDs are strings
    const user = await collection.findOne({ _id: _id });
    
    if (!user) {
      console.log('No user found with ID:', _id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", { _id: user._id, Following: user.Following?.length || 0 });
    return res.status(200).json({ user });

  } catch (e) {
    console.error("Database error:", e);
    return res.status(500).json({ 
      error: 'Unable to get user in MongoDB',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
}
