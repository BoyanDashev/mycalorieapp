import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [firstname, setFirstName] = useState("");
  const [totalweight, setWeight] = useState("");
  const [totalheight, setHeight] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/profile/",
            { withCredentials: true }
          );
          setProfile(response.data);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch profile data.");
          setProfile(null);
        }
      };

      fetchProfile();
    } else {
      setProfile(null);
      setError("User is not authenticated.");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/api/profile/",
        { name: firstname, weight: totalweight, height: totalheight },
        { withCredentials: true }
      );

      setProfile(response.data.user);
      setError(null);
    } catch (error) {
      setError("Failed to edit the profile, please provide full information");
    }
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  return (
    <div className="flex items-start justify-center h-screen bg-gradient-to-r from-slate-400 via-blue-500 to-purple-600">
      <div className="text-center mt-4 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 font-sans">
          Welcome to your profile.
        </h1>
        <p className="text-lg text-gray-600 font-sans">
          You can edit your personal details here:
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstname}
            placeholder="Edit your first name."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <input
            type="number"
            onChange={(e) => setWeight(e.target.value)}
            value={totalweight}
            placeholder="Edit or input your weight in kg."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <input
            type="number"
            onChange={(e) => setHeight(e.target.value)}
            value={totalheight}
            placeholder="Edit or input your height in cm."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <button className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Edit
          </button>
        </form>

        <div>
          <h2>Profile</h2>
          {error ? (
            <p>{error}</p>
          ) : profile ? (
            <div>
              <h3>Profile Information:</h3>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Weight:</strong> {profile.weight}
              </p>
              <p>
                <strong>Height:</strong> {profile.height}
              </p>
              <p>
                <strong>BMI:</strong>
                {calculateBMI(profile.weight, profile.height).toFixed(2)}
              </p>
            </div>
          ) : (
            <p>Please provide information.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
