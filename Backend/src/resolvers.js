import { connectToDb } from './DbConnection.js';

const DB = await connectToDb();

const resolvers = {
    getPost: async ({ postId }) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        try {
            console.log('Searching for post with ID:', postId);
            const post = await DB.collection('posts').findOne({ id: postId });
            // console.log('Database query result:', post);
            
            if (!post) {
                throw new Error('Post not found');
            }
            return post;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw new Error('Failed to fetch post');
        }
    },
    
    getAllPosts: async () => {
        try {
            const posts = await DB.collection('posts').find({}).toArray();
            return posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Failed to fetch posts');
        }
    },

    getPostsByAuthor: async ({ authorId }) => {
        if (!authorId) {
            throw new Error('Author ID is required');
        }
        try {
            // console.log('Searching for posts by author:', authorId);
            const posts = await DB.collection('posts').find({ 'author.id': authorId }).toArray();
            // console.log('Found posts for author:', posts);
            
            // ✅ Don't throw error if no posts found, just return empty array
            return posts || [];
        } catch (error) {
            console.error('Error fetching posts by author:', error);
            throw new Error('Failed to fetch posts by author');
        }
    },

    createPost: async ({ postData }) => {
    
        const { title, excerpt, category, content, author } = postData;

        if (!title || !excerpt || !category || !content) {
            throw new Error('All fields are required');
        }
        
        const now = new Date();
        const formatCustomDate = (date) => {
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'long' });
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        
        const newPost = {
            id: new Date().getTime().toString(), 
            title,
            excerpt,
            category,
            content,
            author: {
                id: author.id,
                name: author.name || 'Anonymous',
                email: author.email || '',
                imageUrl: author.imageUrl || '',
                username: author.username || ''
            },
            createdAt: formatCustomDate(now), // ✅ "3-July-2025"
            updatedAt: formatCustomDate(now),
            date: now.toISOString(), // ✅ Add date field for frontend
        };
        
        try {
            const result = await DB.collection('posts').insertOne(newPost);
            return { id: result.insertedId, ...newPost };
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Failed to create post');
        }
    },

    deletePost: async ({ postId }) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        try {
            const result = await DB.collection('posts').deleteOne({ id: postId });
            if (result.deletedCount === 0) {
                throw new Error('Post not found');
            }
            return { success: true, message: 'Post deleted successfully' };
        } catch (error) {
            console.error('Error deleting post:', error);
            throw new Error('Failed to delete post');
        }
    }

}

export default resolvers;