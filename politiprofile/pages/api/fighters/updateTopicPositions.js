import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fighterId, topicPositions } = req.body;

  // Validate required fields
  if (!fighterId || !topicPositions) {
    return res.status(400).json({ error: 'Missing required fields: fighterId or topicPositions' });
  }

  // Validate topicPositions structure
  const validStances = ['support', 'oppose', 'neutral', 'no-position'];
  const validPriorities = ['high', 'medium', 'low'];

  for (const [topic, position] of Object.entries(topicPositions)) {
    if (!position.stance || !position.priority) {
      return res.status(400).json({
        error: `Invalid position for topic "${topic}": must have stance and priority`
      });
    }
    if (!validStances.includes(position.stance)) {
      return res.status(400).json({
        error: `Invalid stance "${position.stance}" for topic "${topic}". Must be: ${validStances.join(', ')}`
      });
    }
    if (!validPriorities.includes(position.priority)) {
      return res.status(400).json({
        error: `Invalid priority "${position.priority}" for topic "${topic}". Must be: ${validPriorities.join(', ')}`
      });
    }
  }

  try {
    await client.connect();
    const database = client.db("default");
    const collection = database.collection("fighters");

    // Convert fighterId to ObjectId if it's a valid ObjectId string
    let queryId;
    try {
      queryId = new ObjectId(fighterId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid fighter ID format' });
    }

    // Update the fighter's topic positions
    const result = await collection.updateOne(
      { _id: queryId },
      { $set: { topicPositions } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Fighter not found' });
    }

    console.log(`Updated topic positions for fighter ${fighterId}`);
    return res.status(200).json({
      message: 'Topic positions updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (e) {
    console.error("Error updating topic positions:", e);
    return res.status(500).json({
      error: "Unable to update fighter topic positions",
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
