// routes/posts.js
import express from 'express';
import resolvers from '../resolvers.js';
import { authenticateUser } from '../middleware/authenticateUser.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await resolvers.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/author', authenticateUser, async (req, res) => {
  try {
    const posts = await resolvers.getPostsByAuthor({ authorId: req.userId });
    res.json(posts || []);
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    res.status(500).json({ error: 'Failed to fetch posts by author' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await resolvers.getPost({ postId: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, excerpt, category, content } = req.body;
    if (!title || !excerpt || !category || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const postData = {
      title,
      excerpt,
      category,
      content,
      author: {
        id: req.userId,
        name: `${req.user.firstName} ${req.user.lastName}`.trim() || req.user.username || 'Anonymous',
        email: req.user.emailAddresses[0]?.emailAddress,
        imageUrl: req.user.profileImageUrl,
        username: req.user.username
      }
    };

    const newPost = await resolvers.createPost({ postData });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const deleted = await resolvers.deletePost({ postId: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted', post: deleted });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
