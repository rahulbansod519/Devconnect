import "../../public/css/PostView.css";
import { useLoaderData, useParams } from "react-router-dom";
import axios from "axios";

export function PostView() {
  const post = useLoaderData();

  // Add error handling for missing post
  if (!post || !post.content) {
    return (
      <div className="post-view-container">
        <div className="post-content">
          <h1>Post Not Found</h1>
          <p>The post you're looking for doesn't exist or failed to load.</p>
        </div>
      </div>
    );
  }

  // Format the date safely
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";

    // If it's already a formatted string like "3-July-2025"
    if (
      typeof dateValue === "string" &&
      dateValue.includes("-") &&
      isNaN(Date.parse(dateValue))
    ) {
      return dateValue;
    }

    // If it's a valid date string or timestamp
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(post.date || post.createdAt);
  // Safe HTML rendering function
  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div className="post-view-container">
      <article className="post-content">
        {/* Post Header */}
        <header className="post-header">
          <div className="post-meta">
            <span className="post-category-badge">
              {post.category || "General"}
            </span>
            <span className="post-date">{formattedDate}</span>
          </div>

          <h1 className="post-title">{post.title || "Untitled"}</h1>
          <p className="post-excerpt">
            {post.excerpt || "No excerpt available"}
          </p>
        </header>

        {/* Post Content */}
        <div className="post-body">
          {post.content.split("\n\n").map((paragraph, index) => {
            // Handle different content types
            if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
              // Section headers
              return (
                <h3 key={index} className="section-header">
                  {paragraph.replace(/\*\*/g, "").replace(":", "")}
                </h3>
              );
            } else if (paragraph.startsWith("```")) {
              // Code blocks
              const codeContent = paragraph.replace(/```\w*\n?/g, "");
              return (
                <pre key={index} className="code-block">
                  <code>{codeContent}</code>
                </pre>
              );
            } else if (paragraph.includes("- **")) {
              // Bullet points with bold text
              const items = paragraph
                .split("\n")
                .filter((item) => item.trim().startsWith("- "));
              return (
                <ul key={index} className="feature-list">
                  {items.map((item, itemIndex) => {
                    const formattedItem = item
                      .substring(2)
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                    return (
                      <li
                        key={itemIndex}
                        className="feature-item"
                        dangerouslySetInnerHTML={createMarkup(formattedItem)}
                      />
                    );
                  })}
                </ul>
              );
            } else if (paragraph.match(/^\d+\./)) {
              // Numbered lists
              const items = paragraph
                .split("\n")
                .filter((item) => item.trim().match(/^\d+\./));
              return (
                <ol key={index} className="numbered-list">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="numbered-item">
                      {item.replace(/^\d+\.\s*/, "")}
                    </li>
                  ))}
                </ol>
              );
            } else if (paragraph.trim() !== "") {
              // Regular paragraphs (skip empty paragraphs)
              const formattedParagraph = paragraph
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/`(.*?)`/g, "<code>$1</code>");

              return (
                <p
                  key={index}
                  className="post-paragraph"
                  dangerouslySetInnerHTML={createMarkup(formattedParagraph)}
                />
              );
            }
            return null; // Skip empty paragraphs
          })}
        </div>

        {/* Post Footer */}
        <footer className="post-footer">
          <div className="post-actions">
            <button className="action-btn like-btn">👍 Like</button>
            <button className="action-btn share-btn">📤 Share</button>
            <button className="action-btn bookmark-btn">🔖 Bookmark</button>
          </div>
        </footer>
      </article>
    </div>
  );
}

// Fixed loader function
export async function fetchPostbyId({ params }) {
  try {
    console.log("Fetching post with ID:", params); // Debug log

    // Use correct API endpoint and full URL
    const response = await axios.get("/api/posts/" + params.id);
    console.log("Fetched post:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching post:",
      error.response?.data || error.message
    );

    // Return null instead of empty array for single post
    return null;
  }
}


