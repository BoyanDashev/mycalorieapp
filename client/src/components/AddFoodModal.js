import React, { useState } from "react";
import { Button, Modal, Label, TextInput } from "flowbite-react";
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
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Add New Food Item</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleFoodSubmit} className="space-y-6 p-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Use this form to add a new food item to your list.
          </p>
          <div className="flex max-w-md flex-col gap-4">
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
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="food-quantity"
                  color="failure"
                  value="Quantity"
                />
              </div>
              <TextInput
                id="food-quantity"
                placeholder="Enter servings"
                required
                value={foodQuantity}
                onChange={(e) => setFoodQuantity(e.target.value)}
                color="failure"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Add Food
          </Button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {logSuccess && (
          <p className="text-green-500">Food item added successfully!</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddFoodModal;
