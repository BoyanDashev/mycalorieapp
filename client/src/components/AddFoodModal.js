import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "axios";

function AddFoodModal({
  openModal,
  setOpenModal,
  fetchFoodHistory,
  setFoodInformation,
  profile,
  foodQuantity,
  setFoodQuantity,
}) {
  const [foodnames, setFoodName] = useState("");
  const [foodcalories, setFoodCalories] = useState("");
  const [foodproteins, setFoodProteins] = useState("");
  const [foodsugars, setFoodSugars] = useState("");
  const [foodfats, setFoodFats] = useState("");
  const [error, setError] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

  const handleFoodSubmit = async (e) => {
    e.preventDefault();

    if (
      !foodnames ||
      !foodcalories ||
      !foodproteins ||
      !foodsugars ||
      !foodfats
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!profile || !profile._id) {
      setError("User profile is not available.");
      return;
    }

    setError(null);
    setLogSuccess(false);

    try {
      const foodResponse = await axios.post(
        "http://localhost:3000/api/food/",
        {
          foodname: foodnames,
          foodcalorie: foodcalories,
          foodprotein: foodproteins,
          foodsugar: foodsugars,
          foodfat: foodfats,
        },
        { withCredentials: true }
      );

      const userId = profile._id;

      const consumptionResponse = await axios.post(
        "http://localhost:3000/api/food-consumption/",
        {
          foodId: foodResponse.data.food._id,
          quantity: foodQuantity,
          userId: userId,
        },
        { withCredentials: true }
      );

      fetchFoodHistory();
      setFoodInformation(consumptionResponse.data.food);
      setLogSuccess(true);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to add food information and log consumption.");
    }
  };

  return (
   <div id="add-food-modal" tabIndex="-1" aria-hidden="true" className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden ${openModal ? 'block' : 'hidden'}`}>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Food Item
            </h3>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form onSubmit={handleFoodSubmit} className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-4">
                Use this form to add a new food item to your list.
              </p>
              <div className="flex flex-col gap-4 mb-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="food-name" color="gray" value="Food Name" />
                  </div>
                  <TextInput
                    id="food-name"
                    placeholder="Enter food name"
                    required
                    value={foodnames}
                    onChange={(e) => setFoodName(e.target.value)}
                    color="gray"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="food-calories" color="gray" value="Calories" />
                  </div>
                  <TextInput
                    id="food-calories"
                    placeholder="Enter calories"
                    required
                    value={foodcalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    color="gray"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="food-proteins" color="info" value="Proteins" />
                  </div>
                  <TextInput
                    id="food-proteins"
                    placeholder="Enter proteins"
                    required
                    value={foodproteins}
                    onChange={(e) => setFoodProteins(e.target.value)}
                    color="info"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="food-sugars" color="success" value="Sugars" />
                  </div>
                  <TextInput
                    id="food-sugars"
                    placeholder="Enter sugars"
                    required
                    value={foodsugars}
                    onChange={(e) => setFoodSugars(e.target.value)}
                    color="success"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="food-fats" color="failure" value="Fats" />
                  </div>
                  <TextInput
                    id="food-fats"
                    placeholder="Enter fats"
                    required
                    value={foodfats}
                    onChange={(e) => setFoodFats(e.target.value)}
                    color="failure"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="food-quantity" color="failure" value="Quantity" />
                  </div>
                  <TextInput
                    id="food-quantity"
                    placeholder="Enter servings"
                    required
                    value={foodQuantity}
                    onChange={(e) => setFoodQuantity(e.target.value)}
                    color="failure"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Food
              </Button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {logSuccess && (
                <p className="text-green-500 mt-2">Food item added successfully!</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default AddFoodModal;
