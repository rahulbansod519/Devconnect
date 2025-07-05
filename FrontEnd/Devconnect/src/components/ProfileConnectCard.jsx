import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const ProfileConnectCard = () => {
  // Function that runs when component loads
  const { getToken } = useAuth();
  const [profiles, setProfiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  // Fetch profiles of users not connected to the current user
  const handleConnect = async (userId) => {
  try {
    const token = await getToken();
    const headers = token ? { authtoken: token } : {};

    const response = await axios.post(
      "/api/users/connect",
      { userId },
      { headers }
    );

    // On success, remove the connected user from the profiles array
    setProfiles((prevProfiles) =>
      prevProfiles.filter((profile) => profile.id !== userId)
    );

  } catch (error) {
    console.error("Error connecting to user:", error);
  }
};


  const fetchProfiles = async () => {
    try {
    
      const token = await getToken();
      const headers = token ? { authtoken: token } : {};
      
      let response;
      try {
        response = await axios.get("/api/users/not-connected", { headers });
      } catch (error) {
        // If not-connected endpoint fails, try getting all users
        console.log("Trying fallback endpoint...");
        response = await axios.get("/api/users/all", { headers });
      }
      
      console.log("API Response:", response.data);
      
      // Ensure we have an array
      const profilesData = Array.isArray(response.data) ? response.data : [];
      setProfiles(profilesData);
      console.log("Profiles set:", profilesData);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      // Set empty array on error to prevent map errors
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchProfiles();
  }, []); // Empty dependency array means it runs only once on mount

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: "2rem",
  };

  const cardListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "18rem",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
    paddingRight: "0.5rem",
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "2px solid #d1d5db",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  };

  const cardContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "1rem",
  };

  const profileImageStyle = {
    width: "4rem",
    height: "4rem",
    borderRadius: "50%",
    border: "2px solid #9ca3af",
    backgroundColor: "#f3f4f6",
    objectFit: "cover",
  };

  const nameStyle = {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#374151",
    margin: "0",
  };

  const connectButtonStyle = {
    fontWeight: "500",
    padding: "0.5rem 2rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontSize: "1rem",
  };

  const connectButtonBlue = {
    ...connectButtonStyle,
    backgroundColor: "#3b82f6",
    color: "white",
  };

  // Show loading state while fetching
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardListStyle}>
          <div style={cardStyle}>
            <div style={cardContentStyle}>
              <p>Loading profiles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state when no profiles are found
  if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={cardListStyle}>
          <div style={cardStyle}>
            <div style={cardContentStyle}>
              <p>No profiles to connect with</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardListStyle}>
        {profiles.map((profile) => (
          <div key={profile.id} style={cardStyle}>
            <div style={cardContentStyle}>
              {/* Profile Image */}
              {profile.profileImageUrl ? (
                <img 
                  src={profile.profileImageUrl} 
                  alt={`${profile.firstName} ${profile.lastName}`}
                  style={profileImageStyle}
                />
              ) : (
                <div style={profileImageStyle}></div>
              )}

              {/* Name */}
              <h3 style={nameStyle}>
                {profile.firstName} {profile.lastName}
              </h3>

              {/* Connect Button */}
              <button
                onClick={() => handleConnect(profile.id)}
                style={connectButtonBlue}
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileConnectCard;