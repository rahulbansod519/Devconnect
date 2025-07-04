// Updated index.js
import express from 'express';
import { connectToDb } from './DbConnection.js';
import { graphqlHTTP } from 'express-graphql';
import resolvers from './resolvers.js';
import schema from './schema.js';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 3000;

const DB = await connectToDb();

// ✅ Enable CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// ✅ Add JSON middleware
app.use(express.json());

// ✅ Add Clerk middleware
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const root = resolvers;

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL interface
}));

const authenticateUser = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        
        console.log('Authentication check - userId:', userId);
        
        if (!userId) {
            return res.status(401).json({ 
                error: 'Authentication required - Please sign in to access this resource' 
            });
        }
        
        // Verify user exists in Clerk
        try {
            const user = await clerkClient.users.getUser(userId);
            req.user = user; // Attach user to request object
            req.userId = userId;
            next();
        } catch (clerkError) {
            console.error('Clerk user verification failed:', clerkError);
            return res.status(401).json({ 
                error: 'Invalid authentication - Please sign in again' 
            });
        }
        
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(401).json({ 
            error: 'Authentication failed' 
        });
    }
};


app.get('/api/posts', async (req, res) => {
    try {
        const posts = await resolvers.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// ✅ FIXED: Move author route BEFORE the :id route
app.get('/api/posts/author', authenticateUser, async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        console.log('Fetching posts for userId:', userId);
        
        // Fetch posts for the authenticated user
        const posts = await resolvers.getPostsByAuthor({ authorId: userId });
        
        console.log('Found posts:', posts);
        
        if (!posts || posts.length === 0) {
            return res.json([]); // Return empty array instead of 404
        }
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts by author:', error);
        res.status(500).json({ error: 'Failed to fetch posts by author', details: error.message });
    }
});

// ✅ Individual post route (moved after author route)
app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        console.log('Fetching post with ID:', postId);
        
        const post = await resolvers.getPost({ postId });
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
});

// ✅ Protected REST endpoint for creating posts
app.post('/api/posts', authenticateUser, async (req, res) => {
    try {
        const { userId, user } = req;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { title, excerpt, category, content} = req.body;
        
        if (!title || !excerpt || !category || !content) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        
        const postData = {
            title,
            excerpt,
            category,
            content,
            author: {
                id: userId,
                name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous',
                email: user.emailAddresses[0]?.emailAddress,
                imageUrl: user.profileImageUrl,
                username: user.username
            }
        };
        
        const newPost = await resolvers.createPost({ postData });
        res.status(201).json(newPost);
        
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

app.delete('/api/posts/:id', authenticateUser, async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId } = req; 
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log('Deleting post with ID:', postId);
        const post = await resolvers.deletePost({ postId });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully', post });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post', details: error.message });
    }
        
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});