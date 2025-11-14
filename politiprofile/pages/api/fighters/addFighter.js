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
    alignmentScore,
    topicPositions
  } = req.body;

  // Validate required fields
  if (!name || !office || !state) {
    return res.status(400).json({ error: 'Missing required fields: name, office, or state' });
  }

  // Validate name length
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
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
    alignmentScore: alignmentScore || 0,
    topicPositions: topicPositions || {},
    Followers: []
  };

  try {
    await client.connect();
    const database = client.db("default");
    const collection = database.collection("fighters");

    const result = await collection.insertOne(fighterDoc);
    console.log(`Fighter created with ID: ${result.insertedId}`);
    return res.status(201).json({
      message: `Fighter created with ID: ${result.insertedId}`,
      fighterId: result.insertedId
    });
  } catch (e) {
    console.error("Error inserting fighter:", e);
    return res.status(500).json({
      error: "Unable to add fighter to MongoDB",
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
