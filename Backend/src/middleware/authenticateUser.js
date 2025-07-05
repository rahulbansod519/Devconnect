// middleware/authenticateUser.js
import { getAuth, clerkClient } from '@clerk/express';

export const authenticateUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

    const user = await clerkClient.users.getUser(userId);
    req.userId = userId;
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication failed:', err);
    res.status(401).json({ error: 'Invalid token or user' });
  }
};
