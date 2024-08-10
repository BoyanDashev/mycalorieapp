import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";

function FoodHistory({ profile, foodHistory,removeFoodItem, personalCalories }) {
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("User is not authenticated.");
    } else if (!profile) {
      setError("Profile is not available.");
    } else {
      setError(null);
    }
  }, [isAuthenticated, profile]); // Dependencies to trigger useEffect

  const totalCalories = (foodHistory || []).reduce((total, item) => {
    const caloriesPerServing = parseFloat(item.foodId.foodcalorie) || 0;
    return total + item.quantity * caloriesPerServing;
  }, 0);

  const totalProteins = (foodHistory || []).reduce((total, item) => {
    const proteinsPerServing = parseFloat(item.foodId.foodprotein) || 0;
    return total + item.quantity * proteinsPerServing;
  }, 0);

  const totalFats = (foodHistory || []).reduce((total, item) => {
    const fatsPerServing = parseFloat(item.foodId.foodfat) || 0;
    return total + item.quantity * fatsPerServing;
  }, 0);

  const totalSugars = (foodHistory || []).reduce((total, item) => {
    const sugarsPerServing = parseFloat(item.foodId.foodsugar) || 0;
    return total + item.quantity * sugarsPerServing;
  }, 0);

  // Handle display based on authentication and error state
  if (!isAuthenticated || error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2>Food Consumption History</h2>

      {foodHistory.length > 0 ? (
        <>
          <ul>
            {foodHistory.map((item) => (
              <li key={item._id}>
                {item.foodId.foodname} - {item.quantity} servings on{" "}
                {new Date(item.date).toLocaleDateString()}
                <button
                  type="button"
                  onClick={() => removeFoodItem(item._id)} // Pass the item._id here
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Delete item</span>
                </button>
              </li>
            ))}
          </ul>

          <p>Total Calories Consumed: {totalCalories}</p>

          <p>Total Proteins Consumed: {totalProteins}</p>
          <p>Total Fats Consumed: {totalFats}</p>
          <p>Total Sugars Consumed: {totalSugars}</p>
          {profile && (
            <p className="font-bold">Calories Left: {personalCalories.calorie - totalCalories}</p>
          )}
          <h2>
            The Food saving is renewed every 24 hours. So after 24 hours the
            Food History will be cleared.
          </h2>
        </>
      ) : (
        <p>No food consumption history available.</p>
      )}
    </div>
  );
}

export default FoodHistory;
