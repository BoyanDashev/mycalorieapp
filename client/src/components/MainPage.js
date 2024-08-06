import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { Button, Modal, Label, TextInput } from "flowbite-react";

const MainPage = () => {
  const [calories, setCalories] = useState("");
  const [foodcalories, setFoodCalories] = useState("");
  const [foodproteins, setFoodProteins] = useState("");
  const [foodsugars, setFoodSugars] = useState("");
  const [foodfats, setFoodFats] = useState("");
  const [foodnames, setFoodName] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [modalPlacement, setModalPlacement] = useState("center");
  const [otherinformation, setOtherInformation] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/profile", 
            { withCredentials: true }
          );
          setProfile(response.data);
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
      setProfile(response.data.user);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to update calorie information.");
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
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
      setOtherInformation(response.data); // Update with new food information
      setError(null);
      setOpenModal(false); // Close modal on successful submit
    } catch (error) {
      console.error(error);
      setError("Failed to add food information.");
    }
  };

  return (
    <div className="flex items-start justify-center h-screen bg-gradient-to-r from-red-400 via-blue-500 to-purple-600">
      <div className="text-center mt-4 p-6 bg-white rounded-lg shadow-lg">
        <h1>Calorie Remaining</h1>
        <p>2890 - 200 = 2690: Your Calorie Goal edit here:</p>
        <form onSubmit={handleCalorieSubmit}>
          <input
            type="number"
            onChange={(e) => setCalories(e.target.value)}
            value={calories}
            placeholder="Edit your calories."
            className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <button
            type="submit"
            className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Edit
          </button>
        </form>

        <button
          onClick={() => setOpenModal(true)}
          className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Add Food
        </button>

        {/* Modal Implementation */}
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

        <div className="shadow-sm mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          {profile
            ? `Calories Left: ${profile.calorie || "N/A"}`
            : "User is not authenticated"}
        </div>

        <p>Goal - Food = Remaining</p>
        <h2>Today's Day</h2>
        <div>
          {profile && profile.foods ? (
            <ul>
              {profile.foods.length > 0 ? (
                profile.foods.map((food) => (
                  <li key={food._id}>
                    {food.foodname} - {food.foodcalorie} calories
                  </li>
                ))
              ) : (
                <li>No foods available</li>
              )}
            </ul>
          ) : (
            <p>User is not authenticated or no foods found</p>
          )}
        </div>

        {/* Display username */}
        <div className="mt-4">
          {profile && profile.username ? (
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
          ) : (
            <p>User is not authenticated</p>
          )}
        </div>

        {/* Display recently added food information */}
        <div className="mt-4">
          {otherinformation && otherinformation.user ? (
            <>
              <h3>Recently Added Food</h3>
              <p>
                <strong>Food Name:</strong>{" "}
                {otherinformation.user.foods.slice(-1)[0]?.foodname || "N/A"}
              </p>
              <p>
                <strong>Food Calories:</strong>{" "}
                {otherinformation.user.foods.slice(-1)[0]?.foodcalorie || "N/A"}
              </p>
              <p>
                <strong>Food Protein:</strong>{" "}
                {otherinformation.user.foods.slice(-1)[0]?.foodprotein || "N/A"}
              </p>
              <p>
                <strong>Food Sugar:</strong>{" "}
                {otherinformation.user.foods.slice(-1)[0]?.foodsugar || "N/A"}
              </p>
              <p>
                <strong>Food Fat:</strong>{" "}
                {otherinformation.user.foods.slice(-1)[0]?.foodfat || "N/A"}
              </p>
            </>
          ) : (
            <p>No food information available</p>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default MainPage;
