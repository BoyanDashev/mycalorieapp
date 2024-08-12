import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import FoodHistory from "./FoodHistory";
import AddFoodModal from "./AddFoodModal";
import SearchFoodModal from "./SearchFoodModal";
import CalorieModal from "./CalorieModal";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

const MainPage = () => {
  const [currentDate, setCurrentDate] = useState(getDate());
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDoubleClick = () => {
    setIsModalOpen(true);
    
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
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
      handleCloseModal();
      setPersonalCalories(response.data.user);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to update calorie information.");
    }
    console.log("Calorie goal updated:", calories);
    
  };

    const removeFoodItem = async (itemId) => {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/food-consumption`,
          {
            data: { id: itemId }, // Send itemId in the request body
            withCredentials: true,
          }
        );
        fetchFoodHistory();
      } catch (error) {
        console.error(
          "Error deleting food item:",
          error.response ? error.response.data : error.message
        );
      }
    };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-slate-400 via-blue-500 to-purple-600">
      <div className="text-center w-full max-w-4xl mx-auto mt-6 mb-6 p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
        {/* Display username */}
        <div className="w-full p-8 bg-blue-50 border border-blue-300 rounded-lg shadow-lg">
          {profile && profile.username ? (
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-700 mb-3">
                Welcome,{" "}
                <span className="text-blue-500">{profile.username}</span>!
              </p>
              <p className="text-lg text-gray-600">
                We're glad to see you back. Check out your daily updates and
                manage your food consumption.
              </p>
            </div>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold">
              User is not authenticated
            </p>
          )}
        </div>
        <h2 className="text-xl font-bold mt-6 mb-4">
          Today's Date: {currentDate}
        </h2>
        <div className="bg-blue-500 mt-4 font-bold text-white rounded-lg shadow-lg hover:bg-blue-600 cursor-pointer">
          {profile ? (
            <>
              <div onDoubleClick={handleDoubleClick} className="p-6 ">
                Your Personal Calories: {personalCalories.calorie}
              </div>
              <CalorieModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCalorieSubmit}
                calories={calories}
                setCalories={setCalories}
              />
            </>
          ) : (
            "User is not authenticated"
          )}
        </div>
        <p className="font-sans font-thin mt-4">
          Double Click to edit your Calories.
        </p>

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
            removeFoodItem={removeFoodItem}
          />
          <SearchFoodModal
            openOtherModal={openOtherModal}
            setOtherModal={setOtherModal}
            profile={profile}
            fetchFoodHistory={fetchFoodHistory}
          />
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Add Food
        </button>
        <button
          onClick={() => setOtherModal(true)}
          className="w-md mt-3 ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Search Foods
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default MainPage;
