import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

/**
 * Article Schema:
 * {
 *   _id: ObjectId,
 *   title: String,
 *   summary: String,
 *   url: String,
 *   source: String,
 *   publishedAt: Date,
 *   tags: Array<String>,  // Topics from our 15 topics
 *   fighterId: ObjectId,  // Associated fighter
 *   type: String,         // 'ARTICLE', 'BILL', 'VIDEO', 'THREAD'
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    page = 1,
    limit = 30,
    tags,           // Filter by topic tags (comma-separated or JSON array)
    fighterId,      // Filter by fighter
    type,           // Filter by content type
    userTopics,     // User's selected topics for filtering
    sortBy = 'relevance'  // 'relevance', 'date'
  } = req.query;

  // Parse tags
  let parsedTags = [];
  if (tags) {
    try {
      parsedTags = typeof tags === 'string'
        ? (tags.includes(',') ? tags.split(',').map(t => t.trim()) : JSON.parse(tags))
        : tags;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid tags format' });
    }
  }

  // Parse userTopics
  let parsedUserTopics = [];
  if (userTopics) {
    try {
      parsedUserTopics = typeof userTopics === 'string' ? JSON.parse(userTopics) : userTopics;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid userTopics format' });
    }
  }

  try {
    await client.connect();
    const database = client.db("default");
    const articlesCollection = database.collection("articles");
    const fightersCollection = database.collection("fighters");

    // Build query
    const query = {};

    if (parsedTags.length > 0) {
      query.tags = { $in: parsedTags };
    } else if (parsedUserTopics.length > 0) {
      // If no specific tags but user has topics, filter by user's interests
      query.tags = { $in: parsedUserTopics };
    }

    if (fighterId) {
      try {
        query.fighterId = new ObjectId(fighterId);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid fighterId format' });
      }
    }

    if (type) {
      query.type = type;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    let sort = {};
    if (sortBy === 'date') {
      sort = { publishedAt: -1 };
    } else {
      // Default relevance sort (newest first for now)
      sort = { publishedAt: -1 };
    }

    // Fetch articles
    const articles = await articlesCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const totalArticles = await articlesCollection.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limit);

    // Populate fighter data
    const articlesWithFighters = await Promise.all(
      articles.map(async (article) => {
        if (article.fighterId) {
          const fighter = await fightersCollection.findOne({ _id: article.fighterId });
          return {
            ...article,
            fighter: fighter || null
          };
        }
        return { ...article, fighter: null };
      })
    );

    return res.status(200).json({
      articles: articlesWithFighters,
      totalArticles,
      totalPages,
      page: Number(page)
    });

  } catch (e) {
    console.error("Error fetching articles:", e);
    return res.status(500).json({
      error: 'Unable to fetch articles',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  } finally {
    await client.close();
  }
}
