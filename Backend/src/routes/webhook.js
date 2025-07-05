import express from 'express';
import { Webhook } from 'svix';
import { connectToDb } from '../DbConnection.js';

const DB = await connectToDb();
const router = express.Router();

// 🔐 Middleware to verify Clerk webhook signature
const verifyWebhook = (req, res, next) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  const payload = req.body.toString('utf8'); // ✅ Correctly capture raw body

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  req.evt = evt;
  next();
};

// 📥 Main webhook handler
router.post('/clerk', verifyWebhook, async (req, res) => {
  const { type, data } = req.evt;

  console.log('📬 Webhook received. Type:', type);

  try {
    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      default:
        console.log('⚠️ Unhandled webhook type:', type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// 🧱 Handle user.created
async function handleUserCreated(userData) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    image_url,
    username,
    created_at,
  } = userData;

  const user = {
    id,
    email: email_addresses[0]?.email_address || '',
    emailAddresses: email_addresses,
    firstName: first_name || '',
    lastName: last_name || '',
    profileImageUrl: image_url || '',
    username: username || '',
    createdAt: new Date(created_at),
    updatedAt: new Date(),
  };

  console.log('🛠 Inserting new user:', user);

  try {
    const existing = await DB.collection('users').findOne({ id });
    if (existing) {
      console.log('🔁 User already exists:', id);
      return;
    }

    const result = await DB.collection('users').insertOne(user);
    console.log('✅ User inserted into MongoDB:', result.insertedId);
  } catch (err) {
    console.error('❌ Error inserting user:', err);
  }
}

// 🛠 Handle user.updated
async function handleUserUpdated(userData) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    image_url,
    username,
  } = userData;

  const updateData = {
    email: email_addresses[0]?.email_address || '',
    emailAddresses: email_addresses,
    firstName: first_name || '',
    lastName: last_name || '',
    profileImageUrl: image_url || '',
    username: username || '',
    updatedAt: new Date(),
  };

  try {
    const result = await DB.collection('users').updateOne(
      { id },
      { $set: updateData }
    );

    console.log('✅ User updated in MongoDB:', id, result.modifiedCount);
  } catch (err) {
    console.error('❌ Error updating user:', err);
  }
}

// 🗑 Handle user.deleted
async function handleUserDeleted(userData) {
  const { id } = userData;

  try {
    const result = await DB.collection('users').deleteOne({ id });
    console.log('✅ User deleted from MongoDB:', id, result.deletedCount);
  } catch (err) {
    console.error('❌ Error deleting user:', err);
  }
}

export default router;
