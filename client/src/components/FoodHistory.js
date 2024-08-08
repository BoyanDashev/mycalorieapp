import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function FoodHistory() {
  const [foodHistory, setFoodHistory] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/mainpage",
            {
              withCredentials: true,
            }
          );
          setProfile(response.data);
          fetchFoodHistory(response.data._id); // Fetch food history after setting profile
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
      const response = await axios.get(
        `http://localhost:3000/api/food-consumption/`,
        {
          withCredentials: true,
        }
      );
      setFoodHistory(response.data);
    } catch (error) {
      console.error("Error fetching food history:", error);
      setError("Failed to fetch food history.");
    }
  };

  if (!isAuthenticated) {
    return <p>{error}</p>;
  }

  let totalCalories = 0;

  return (
    <div>
      <h2>Food Consumption History</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Check if foodHistory has items */}
      {foodHistory.length > 0 ? (
        <>
          <ul>
            {/* Iterate over each item in foodHistory */}
            {foodHistory.map((item) => (
              <li key={item._id}>
                {/* Display food name, quantity, and date */}
                {item.foodId.foodname} - {item.quantity} servings on{" "}
                {new Date(item.date).toLocaleDateString()}
              </li>
            ))}
          </ul>

          {/* Calculate and display total calories for all items */}
          <p>
            Total Calories Consumed:{" "}
            { totalCalories =foodHistory.reduce((total, item) => {
              // Ensure item.foodId.foodcalorie is a number
              const caloriesPerServing =
                parseFloat(item.foodId.foodcalorie) || 0;
              return total + item.quantity * caloriesPerServing;
            }, 0)}
          </p>
          <p>Calories Left:{ profile.calorie - totalCalories }</p>
        </>
      ) : (
        <p>No food consumption history available.</p>
      )}
    </div>
  );
}

export default FoodHistory;
