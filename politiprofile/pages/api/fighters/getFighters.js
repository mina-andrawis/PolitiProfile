import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {state, page = 1, limit = 30 } = req.query;

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("fighters");

            const query = {};
      // If state is provided, prioritize that
      if (state) {
        query.state = state;
      }

      if (state) {
        // Fetch a single document when state is provided
        const fighter = await collection.findOne(query);
        if (!fighter) {
          return res.status(404).json({ message: "Fighter not found" });
        }
        return res.status(200).json({ fighter });
      }

      // Fetch multiple fighters with pagination
      const skip = (page - 1) * limit;
      const fighters = await collection.find(query).skip(skip).limit(Number(limit)).toArray();
      const totalFighters = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalFighters / limit);

      return res.status(200).json({ fighters, totalFighters, totalPages });
    } catch (e) {
      console.error("Error fetching fighters:", e);
      res.status(500).json({ error: 'Unable to get fighters from MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
