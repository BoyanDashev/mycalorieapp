import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "axios";

function SearchFoodModal({
  openOtherModal,
  profile,
  fetchFoodHistory,
  setOtherModal,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");

  const addFoodItem = async (foodId, foodQuantity) => {
    try {
      const userId = profile._id;

      await axios.post(
        "/api/food-consumption/",
        {
          foodId,
          quantity: foodQuantity,
          userId,
        },
        { withCredentials: true }
      );

      fetchFoodHistory();
      setFoodQuantity("");
      setError("");
      setOtherModal(false);
    } catch (error) {
      console.error("Error adding food item:", error);
      setError("Failed to add food item.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("/api/search/", {
        params: { query },
      });
      setResults(response.data);
      setError("");
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results.");
    }
  };

  return (
    <div
      id="search-food-modal"
      tabIndex="-1"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden ${
        openOtherModal ? "block" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Search Already Existing Food Item
            </h3>
            <button
              type="button"
              onClick={() => setOtherModal(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
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
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-4">
              Use this form to search for a Food Item.
            </p>
            <div className="flex flex-col gap-4 mb-4">
              <div className="mb-2 block">
                <Label htmlFor="food-search" value="Food Search" />
              </div>
              <TextInput
                id="food-search"
                placeholder="Search food name."
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search Food
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {results.length > 0 && (
              <ul className="mt-4 space-y-2">
                {results.map((food) => (
                  <li
                    key={food._id}
                    className="flex justify-between items-center"
                  >
                    <span>{food.foodname}</span>
                    <span>{food.foodcalorie} calories</span>
                    <div className="flex flex-col items-end">
                      <div className="mb-2 block">
                        <Label htmlFor="food-quantity" value="Quantity" />
                      </div>
                      <TextInput
                        id="food-quantity"
                        placeholder="Enter quantity"
                        required
                        type="number"
                        value={foodQuantity}
                        onChange={(e) => setFoodQuantity(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => addFoodItem(food._id, foodQuantity)}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white mt-2"
                      >
                        <svg
                          className="text-blue-500 w-7 h-7"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="sr-only">Add item</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFoodModal;
