import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/profile",
            {
              withCredentials: true, // Include cookies for authentication
            }
          );
          setProfile(response.data);
          setError(null); // Clear error if data is fetched successfully
        } catch (err) {
          setError("Failed to fetch profile data.");
          setProfile(null); // Clear profile data if there's an error
        }
      };

      fetchProfile();
    } else {
      setProfile(null);
      setError("User is not authenticated.");
    }
  }, [isAuthenticated]); // Dependency array includes isAuthenticated

  return (
    <div>
      <h2>Profile</h2>
      {error ? (
        <p>{error}</p>
      ) : profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
