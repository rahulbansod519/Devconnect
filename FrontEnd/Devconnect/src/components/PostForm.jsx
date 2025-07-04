import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import "../../public/css/PostForm.css"; // Adjust the path as necessary

export default function PostForm() {
  const [postData, setPostData] = useState({
    title: "",
    excerpt: "",
    category: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      const headers = token ? { authtoken: token } : {};
      console.log("Post data being submitted:", postData);

      const response = await axios.post("/api/posts", postData, { headers });
      setPostData({
        title: "",
        excerpt: "",
        category: "",
        content: "",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        <h2>Create New Post</h2>
        <p>Share your thoughts with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your post title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt" className="form-label">
            Excerpt
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            value={postData.excerpt}
            onChange={handleChange}
            className="form-input"
            placeholder="Brief description of your post"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={postData.category}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Technology, Lifestyle, Business"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Content <span className="required">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={postData.content}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Write your post content here..."
            rows="8"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Post...
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}