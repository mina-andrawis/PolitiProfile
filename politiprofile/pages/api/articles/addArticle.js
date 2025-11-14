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

  const {
    title,
    summary,
    url,
    source,
    publishedAt,
    tags,       // Array of topic names
    fighterId,  // ObjectId string
    type        // 'ARTICLE', 'BILL', 'VIDEO', 'THREAD'
  } = req.body;

  // Validate required fields
  if (!title || !url || !type) {
    return res.status(400).json({
      error: 'Missing required fields: title, url, and type are required'
    });
  }

  // Validate type
  const validTypes = ['ARTICLE', 'BILL', 'VIDEO', 'THREAD'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Convert fighterId to ObjectId if provided
  let fighterObjectId = null;
  if (fighterId) {
    try {
      fighterObjectId = new ObjectId(fighterId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid fighterId format' });
    }
  }

  const articleDoc = {
    title,
    summary: summary || '',
    url,
    source: source || '',
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    tags: Array.isArray(tags) ? tags : [],
    fighterId: fighterObjectId,
    type,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    await client.connect();
    const database = client.db("default");
    const collection = database.collection("articles");

    // Check for duplicate URL
    const existingArticle = await collection.findOne({ url });
    if (existingArticle) {
      return res.status(409).json({ error: 'Article with this URL already exists' });
    }

    const result = await collection.insertOne(articleDoc);
    console.log(`Article created with ID: ${result.insertedId}`);

    return res.status(201).json({
      message: 'Article created successfully',
      articleId: result.insertedId
    });

  } catch (e) {
    console.error("Error creating article:", e);
    return res.status(500).json({
      error: 'Unable to create article',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
