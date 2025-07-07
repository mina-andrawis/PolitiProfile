import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      name,
      office,
      state,
      party,
      photoUrl,
      issues,
      endorsements,
      quote,
      donationLink,
      socialLinks,
      status,
      runningForReelection,
      tags,
      bio,
      alignmentScore
    } = req.body;

    // Minimal required fields validation
    if (!name || !office || !state) {
      return res.status(400).json({ error: 'Missing required fields: name, office, or state' });
    }

    const fighterDoc = {
      name,
      office,
      state,
      party: party || '',
      photoUrl: photoUrl || '',
      issues: issues || [],
      endorsements: endorsements || [],
      quote: quote || '',
      donationLink: donationLink || '',
      socialLinks: {
        twitter: socialLinks?.twitter || '',
        website: socialLinks?.website || '',
        instagram: socialLinks?.instagram || ''
      },
      status: status || 'candidate',
      runningForReelection: runningForReelection ?? false,
      tags: tags || [],
      bio: bio || '',
      alignmentScore: alignmentScore || 0
    };

    try {
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("fighters");

      const result = await collection.insertOne(fighterDoc);
      console.log(`Fighter created with ID: ${result.insertedId}`);
      res.status(200).json({ message: `Fighter created with ID: ${result.insertedId}` });
    } catch (e) {
      console.error("Error inserting fighter:", e);
      res.status(500).json({ error: "Unable to add fighter to MongoDB" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
