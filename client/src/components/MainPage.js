import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import FoodHistory from "./FoodHistory";
import AddFoodModal from "./AddFoodModal";
import SearchFoodModal from "./SearchFoodModal";

const MainPage = () => {
  const [calories, setCalories] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openOtherModal, setOtherModal] = useState(false);
  const [foodinformation, setFoodInformation] = useState("");
  const [personalCalories, setPersonalCalories] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [logError, setLogError] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);
  const [foodHistory, setFoodHistory] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/mainpage",
            { withCredentials: true }
          );
          setProfile(response.data);
          setFoodInformation(response.data);
          setPersonalCalories(response.data);
          fetchFoodHistory();
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

  const handleCalorieSubmit = async (e) => {
    e.preventDefault();
    try {
      const calorieValue = calories;
      const response = await axios.put(
        "http://localhost:3000/api/mainpage/",
        { calorie: calorieValue },
        { withCredentials: true }
      );
      fetchFoodHistory();
      setPersonalCalories(response.data.user);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to update calorie information.");
    }
  };

  const fetchFoodHistory = async () => {
    try {
      const getComsunption = await axios.get(
        "http://localhost:3000/api/food-consumption/",
        { withCredentials: true }
      );
      setFoodHistory(getComsunption.data);
      setError("");
    } catch (err) {
      console.error("Error Fetching the Foods");
      setError("Failed to Fetch Users Foods.");
    }
  };

  return (
    <div className="flex items-start justify-center bg-gradient-to-r from-slate-400 via-blue-500 to-purple-600">
      <div className="text-center mb-4 mt-4 p-6 bg-white rounded-lg shadow-lg">
        {/* Display username */}
        <div className="mt-4">
          {profile && profile.username ? (
            <p>
              <strong>Welcome:</strong> {profile.username}
            </p>
          ) : (
            <p>User is not authenticated</p>
          )}
        </div>
        <h2>Here should be Today's Day</h2>
        <div className="shadow-sm mt-3 bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          {profile
            ? `Today's Calorie goal: ${personalCalories.calorie || "N/A"}`
            : "User is not authenticated"}
        </div>
        <form className="flex " onSubmit={handleCalorieSubmit}>
          <input
            type="number"
            onChange={(e) => setCalories(e.target.value)}
            value={calories}
            placeholder="Edit your calories."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <button
            type="submit"
            className="w-md mt-3 ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Edit your calorie goal.
          </button>
        </form>

        {logError && <p className="text-red-500">{logError}</p>}
        {logSuccess && (
          <p className="text-green-500">
            Food consumption logged successfully!
          </p>
        )}

        <AddFoodModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchFoodHistory={fetchFoodHistory}
          setFoodInformation={setFoodInformation}
          profile={profile}
          foodQuantity={foodQuantity}
          setFoodQuantity={setFoodQuantity}
        />

        <div className="shadow-sm mt-3 bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          <FoodHistory
            profile={profile}
            foodHistory={foodHistory}
            personalCalories={personalCalories}
          />
          <SearchFoodModal
            openOtherModal={openOtherModal}
            setOtherModal={setOtherModal}
          />
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Add Food.
        </button>
        <button
          onClick={() => setOtherModal(true)}
          className="w-md mt-3 ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Search Foods.
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default MainPage;
