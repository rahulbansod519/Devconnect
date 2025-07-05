// routes/users.js
import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { connectToDb } from '../DbConnection.js';
import resolvers from '../resolvers.js';

const DB = await connectToDb();
const router = express.Router();

//router to get all users not connected to the current user
router.get('/not-connected', authenticateUser, async (req, res) => {
  try {
    const currentUserId = req.userId;
    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const users = await resolvers.getNotConnectedUsers({ currentUserId });
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found' });  
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching not connected users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/connected', authenticateUser, async (req, res) => {
  try {
    const currentUserId = req.userId;
    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const users = await resolvers.getConnectedUsers({ currentUserId });
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No connected users found' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching connected users:', error);
    res.status(500).json({ error: 'Failed to fetch connected users' });
  } 
});

router.post('/connect', authenticateUser, async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.userId;

  if (!currentUserId || !userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    // Check if the user is already connected
    const currentUser = await DB.collection('users').findOne({ id: currentUserId });
    if (currentUser.connections && currentUser.connections.includes(userId)) {
      return res.status(400).json({ error: 'Already connected' });
    }

    // Update both users' connections
    await DB.collection('users').updateOne(
      { id: currentUserId },
      { $addToSet: { connections: userId } }
    );
    
    await DB.collection('users').updateOne(
      { id: userId },
      { $addToSet: { connections: currentUserId } }
    );

    res.json({ message: 'Connection successful' });
  } catch (error) {
    console.error('Error connecting users:', error);
    res.status(500).json({ error: 'Failed to connect users' });
  }
})

router.post('/disconnect', authenticateUser, async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.userId;

  if (!currentUserId || !userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const currentUser = await DB.collection('users').findOne({ id: currentUserId });

    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found in DB' });
    }

    if (!Array.isArray(currentUser.connections) || !currentUser.connections.includes(userId)) {
      return res.status(400).json({ error: 'Not connected' });
    }

    await DB.collection('users').updateOne(
      { id: currentUserId },
      { $pull: { connections: userId } }
    );

    await DB.collection('users').updateOne(
      { id: userId },
      { $pull: { connections: currentUserId } }
    );

    res.json({ message: 'Disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting users:', error);
    res.status(500).json({ error: 'Failed to disconnect users' });
  }
});


export default router;
