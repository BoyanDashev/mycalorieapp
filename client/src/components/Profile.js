import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [firstname, setFirstName] = useState('');

//   useEffect(() => {
  
// },[firstname])


  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/profile/",
            {
              withCredentials: true, // Include cookies for authentication
            }
          );
          setProfile(response.data.user);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/api/profile/",
        { name: firstname },
        { withCredentials: true } // Include cookies for authentication
      );
      // Update profile state with the new data
      setProfile(response.data.user); // Adjust based on your server response structure
      setError(null);
    } catch (error) {
      setError("Failed to edit the name");
    }
  };

  return (
    <div className="flex items-start justify-center h-screen bg-gradient-to-r from-red-400 via-blue-500 to-purple-600">
      <div className="text-center mt-4 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 font-sans">
          Welcome to your profile.
        </h1>
        <p className="text-lg text-gray-600 font-sans">
          You can edit your name here:
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstname}
            placeholder="Edit your first name."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          ></input>
          {/* <input
            type="text"
            placeholder="Edit your last name."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          ></input> */}
          <button className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Edit
          </button>
        </form>

        <input></input>
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
      </div>
    </div>
  );
}

export default Profile;
