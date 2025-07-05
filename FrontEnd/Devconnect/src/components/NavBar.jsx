import "../../public/css/NavBar.css"; // Adjust the path as necessary
import {
  SignedIn,
  UserButton,
  SignInButton,
  SignedOut,
} from "@clerk/clerk-react";

export default function NavBar() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1>DevConnect</h1>
            <span className="brand-tagline">Connect. Code. Create.</span>
          </div>

          <ul className="navbar-menu">
            <li className="navbar-item">
              <a href="/" className="navbar-link">
                <span className="link-icon">🏠</span>
                Home
              </a>
            </li>
             <SignedIn>
            <li className="navbar-item">
              <a href="/posts/author" className="navbar-link">
                <span className="link-icon">👥</span>
                My Posts
              </a>
            </li>
            </SignedIn>

            <SignedIn>
            <li className="navbar-item">
              <a href="/user/getConnection" className="navbar-link">
                <span className="link-icon">📝</span>
                Your Connections
              </a>
            </li>
            </SignedIn>
  
          </ul>

          <div className="navbar-actions">
            <SignedIn>
                <button className="create-post-button">
                    <a href="/post/submit">Create Post</a>
                </button>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </nav>
    </>
  );
}