import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";

function FoodHistory({ profile, foodHistory, personalCalories }) {
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

  // Calculate total calories based on the passed foodHistory prop
  const totalCalories = (foodHistory || []).reduce((total, item) => {
    const caloriesPerServing = parseFloat(item.foodId.foodcalorie) || 0;
    return total + item.quantity * caloriesPerServing;
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
              </li>
            ))}
          </ul>

          <p>Total Calories Consumed: {totalCalories}</p>
          {profile && <p>Calories Left: {personalCalories.calorie - totalCalories}</p>}
        </>
      ) : (
        <p>No food consumption history available.</p>
      )}
    </div>
  );
}

export default FoodHistory;
