import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { Button, Modal, Label, TextInput } from "flowbite-react";
import FoodHistory from "./FoodHistory";

const MainPage = () => {
  const [calories, setCalories] = useState("");
  const [foodcalories, setFoodCalories] = useState("");
  const [foodproteins, setFoodProteins] = useState("");
  const [foodsugars, setFoodSugars] = useState("");
  const [foodfats, setFoodFats] = useState("");
  const [foodnames, setFoodName] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openOtherModal, setOtherModal] = useState(false);
  const [modalPlacement, setModalPlacement] = useState("center");
  const [foodinformation, setFoodInformation] = useState("");
  const [personalCalories, setPersonalCalories] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [logError, setLogError] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

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
      setPersonalCalories(response.data.user);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to update calorie information.");
    }
  };

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

      setFoodInformation(consumptionResponse.data.food);
      setLogSuccess(true);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to add food information and log consumption.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/search/", {
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
    <div className="flex items-start justify-center h-screen bg-gradient-to-r from-red-400 via-blue-500 to-purple-600">
      <div className="text-center mt-4 p-6 bg-white rounded-lg shadow-lg">
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

        <Modal
          show={openModal}
          onClose={() => setOpenModal(false)}
          position={modalPlacement}
        >
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
                    <Label
                      htmlFor="food-calories"
                      color="gray"
                      value="Calories"
                    />
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
                    <Label
                      htmlFor="food-proteins"
                      color="info"
                      value="Proteins"
                    />
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
                    <Label
                      htmlFor="food-sugars"
                      color="success"
                      value="Sugars"
                    />
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

        <Modal
          show={openOtherModal}
          onClose={() => setOtherModal(false)}
          position={openOtherModal}
        >
          <Modal.Header>Search already existing Food Item</Modal.Header>
          <Modal.Body>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Use this form to search for a Food Item.
            </p>
            <div className="flex max-w-md flex-col gap-4">
              <div className="mb-2 block">
                <Label
                  htmlFor="food-search"
                  color="failure"
                  value="Food Search"
                />
              </div>
              <TextInput
                id="food-search"
                placeholder="Search food name."
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                color="failure"
              />
            </div>
            <Button
              onClick={handleSearch}
              type="submit"
              className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Search Food.
            </Button>
            {error && <p>{error}</p>}
            {results.length > 0 && (
              <ul>
                {results.map((food) => (
                  <li key={food._id}>
                    {food.foodname} - {food.foodcalorie} calories
                  </li>
                ))}
              </ul>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={() => setOtherModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="shadow-sm mt-3 bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          <FoodHistory />
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
