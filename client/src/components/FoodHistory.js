import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";

function FoodHistory({
  profile,
  foodHistory = [],
  removeFoodItem,
  personalCalories,
}) {
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
  }, [isAuthenticated, profile]);

  const calculateTotal = (key) =>
    foodHistory.reduce((total, item) => {
      const valuePerServing = parseFloat(item.foodId[key]) || 0;
      return total + item.quantity * valuePerServing;
    }, 0);

  const totalCalories = calculateTotal("foodcalorie");
  const totalProteins = calculateTotal("foodprotein");
  const totalFats = calculateTotal("foodfat");
  const totalSugars = calculateTotal("foodsugar");

  // Handle display based on authentication and error state
  if (!isAuthenticated || error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Food Consumption History
      </h2>

      {foodHistory.length > 0 ? (
        <>
          <ul className="space-y-4">
            {foodHistory.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <div className="flex-1">
                  <span className="font-semibold">{item.foodId.foodname}</span>{" "}
                  - {item.quantity} servings on{" "}
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <button
                  type="button"
                  onClick={() => removeFoodItem(item._id)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 ml-4"
                >
                  <svg
                    className="w-4 h-4"
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

          <div className="mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <p className="font-semibold">
              Total Calories Consumed: {totalCalories}
            </p>
            <p className="font-semibold">
              Total Proteins Consumed: {totalProteins}
            </p>
            <p className="font-semibold">Total Fats Consumed: {totalFats}</p>
            <p className="font-semibold">
              Total Sugars Consumed: {totalSugars}
            </p>
            {profile && (
              <p className="font-bold text-red-600 mt-2">
                Calories Left: {personalCalories.calorie - totalCalories}
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <h2 className="font-semibold text-md">
              The Food saving is renewed every 24 hours. So after 24 hours the
              Food History will be cleared. All Food History is still saved at
              the back-end.
            </h2>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">
          No food consumption history available.
        </p>
      )}
    </div>
  );
}

export default FoodHistory;
