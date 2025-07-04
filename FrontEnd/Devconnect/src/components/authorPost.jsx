import { Link } from "react-router-dom";
import "../../public/css/PostsBanner.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export function AuthorPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    console.log("Fetching posts...");
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const headers = token ? { authtoken: token } : {};

      const response = await axios.get("/api/posts/author", { headers });
    //   console.log("Fetched posts:", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!isConfirmed) {
      return;
    }
    console.log("Deleting post with ID:", postId);
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const headers = token ? { authtoken: token } : {};

      const response = await axios.delete(`/api/posts/${postId}`, { headers });
    //   console.log("Post deleted:", response.data);

      // Refresh posts after deletion
      fetchMyPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="posts-banner-container">
        <div className="posts-container">
          <p>Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-banner-container">
        <div className="posts-container">
          <p>{error}</p>
          <button onClick={fetchMyPosts}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-banner-container">
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>No posts found. Start writing your first post!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-date">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h3 className="post-title">{post.title}</h3>

              <p className="post-excerpt">{post.excerpt}</p>

              <div className="post-read-more">
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="read-more-link"
                >
                  Read more →
                </Link>
              </div>
              <div className="post-actions">
                <button
                  onClick={handleDeletePost(post.id)}
                  // disabled={deletingPostId === post.id}
                  className="delete-button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc3545",
                    //   cursor: deletingPostId === post.id ? 'not-allowed' : 'pointer',
                    fontSize: "14px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    //   opacity: deletingPostId === post.id ? 0.6 : 1
                  }}
                >
                  {"🗑️ Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="posts-banner-footer">
        <button className="view-all-button">View All Posts</button>
      </div>
    </div>
  );
}
