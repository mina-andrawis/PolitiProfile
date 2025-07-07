import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, fighterId } = req.body;

    if (!userId || !fighterId) {
      return res.status(400).json({ error: "Missing userId or fighterId" });
    }

    try {
      await client.connect();
      const db = client.db("default");
      const usersCollection = db.collection("users");
      const fightersCollection = db.collection("fighters");

      console.log("Following logic: userId:", userId, "fighterId:", fighterId);

      // 1. Update user's Following array
      const userUpdate = await usersCollection.updateOne(
        { _id: userId },
        { $addToSet: { Following: new ObjectId(fighterId) } }
      );

      // 2. Update fighter's Followers array
      const fighterUpdate = await fightersCollection.updateOne(
        { _id: new ObjectId(fighterId) },
        { $addToSet: { Followers: userId } }
      );

      if (userUpdate.modifiedCount === 0 && fighterUpdate.modifiedCount === 0) {
        return res.status(404).json({ error: "No updates made. Check if IDs exist." });
      }

      return res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
      console.error("Follow error:", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
