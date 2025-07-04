
import { Link } from 'react-router-dom';
// import posts from '../posts'; // Adjust the path as necessary
import '../../public/css/PostsBanner.css'; // Adjust the path as necessary
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

export function PostsBannerList(){
  const posts = useLoaderData(); // Use loader data to fetch posts
    return (
    <div className="posts-banner-container">
      <div className="posts-banner-header">
        <h2 className="posts-banner-title">📝 Latest Posts</h2>
        <p className="posts-banner-subtitle">Stay updated with our content</p>
      </div>
      
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <span className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <h3 className="post-title">
              {post.title}
            </h3>
            
            <p className="post-excerpt">
              {post.excerpt}
            </p>
            
            <div className="post-read-more">
            <Link key={post.id} to={'/posts/' + post.id} className="read-more-link">
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="posts-banner-footer">
        <button className="view-all-button">
          View All Posts
        </button>
      </div>
    </div>
  );
};

export async function fetchAllPost() {
  try {
    const response = await axios.get('/api/posts');
    // console.log('Fetched posts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}


