/**
 * Admin Authentication Helper
 *
 * Verifies that the user making the request is an admin
 */

import { MongoClient } from 'mongodb';

const ADMIN_EMAIL = 'mi.andrawis@gmail.com';

/**
 * Check if a user ID is an admin by checking the database
 * @param {string} userId - Firebase UID
 * @returns {Promise<boolean>}
 */
export async function isUserAdmin(userId) {
  if (!userId) return false;

  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("default");
    const collection = database.collection("users");

    const user = await collection.findOne({ _id: userId });

    return user?.email === ADMIN_EMAIL;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  } finally {
    await client.close();
  }
}

/**
 * Middleware to verify admin access
 * Usage: const isAdmin = await verifyAdminAccess(req);
 * @param {NextApiRequest} req
 * @returns {Promise<boolean>}
 */
export async function verifyAdminAccess(req) {
  // Get userId from request body or query
  const userId = req.body?.userId || req.query?.userId;

  if (!userId) {
    return false;
  }

  return await isUserAdmin(userId);
}

/**
 * Higher-order function to protect admin routes
 * Usage: export default withAdminAuth(handler);
 */
export function withAdminAuth(handler) {
  return async (req, res) => {
    const isAdmin = await verifyAdminAccess(req);

    if (!isAdmin) {
      return res.status(403).json({
        error: 'Forbidden: Admin access required'
      });
    }

    return handler(req, res);
  };
}

export default {
  isUserAdmin,
  verifyAdminAccess,
  withAdminAuth,
  ADMIN_EMAIL
};
