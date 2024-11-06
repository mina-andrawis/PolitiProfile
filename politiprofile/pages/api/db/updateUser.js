import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { _id, updateData } = req.body; // Expecting the user ID and update data in the request body

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("users");

      console.log("Updating user with ID:", _id);
      console.log("Update data:", updateData);
      // Use PATCH-style update for partial updates
      const updateResult = await collection.updateOne(
        { _id: _id },
        { $set: updateData } // Only update the fields provided in updateData
      );

      if (updateResult.modifiedCount === 1) {
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(404).json({ error: "User not found or no changes made" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Unable to update user in MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
