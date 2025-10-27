import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, fighterId, action } = req.body;

  if (!userId || !fighterId || !action) {
    return res
      .status(400)
      .json({ error: "Missing userId, fighterId, or action" });
  }

  if (action !== "follow" && action !== "unfollow") {
    return res
      .status(400)
      .json({ error: 'Invalid action. Use "follow" or "unfollow".' });
  }

  try {
    await client.connect();
    const db = client.db("default");
    const usersCollection = db.collection("users");
    const fightersCollection = db.collection("fighters");

    console.log(
      `[${action.toUpperCase()}] userId: ${userId} fighterId: ${fighterId}`
    );

    // follow -> addToSet
    // unfollow -> pull
    const userUpdateOp =
      action === "follow"
        ? { $addToSet: { Following: new ObjectId(fighterId) } }
        : { $pull: { Following: new ObjectId(fighterId) } };

    const fighterUpdateOp =
      action === "follow"
        ? { $addToSet: { Followers: userId } }
        : { $pull: { Followers: userId } };

    // user._id looks like a Firebase uid string in your code,
    // so we do NOT wrap userId in ObjectId here.
    const userUpdate = await usersCollection.updateOne(
      { _id: userId },
      userUpdateOp
    );

    const fighterUpdate = await fightersCollection.updateOne(
      { _id: new ObjectId(fighterId) },
      fighterUpdateOp
    );

    // If neither doc changed, it might already be in that state.
    if (userUpdate.modifiedCount === 0 && fighterUpdate.modifiedCount === 0) {
      return res.status(200).json({
        message:
          action === "follow"
            ? "Already following"
            : "Already not following",
        userModified: userUpdate.modifiedCount,
        fighterModified: fighterUpdate.modifiedCount,
      });
    }

    return res.status(200).json({
      message:
        action === "follow"
          ? "Followed successfully"
          : "Unfollowed successfully",
      userModified: userUpdate.modifiedCount,
      fighterModified: fighterUpdate.modifiedCount,
    });
  } catch (error) {
    console.error("Follow/unfollow error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
