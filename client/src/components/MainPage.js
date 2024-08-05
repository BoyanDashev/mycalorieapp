import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { Button, Modal } from "flowbite-react";

const MainPage = () => {
  const [calories, setCalories] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [modalPlacement, setModalPlacement] = useState("center");

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/mainpage/",
            {
              withCredentials: true,
            }
          );
          setProfile(response.data.user);
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

  const handleSubmit = async (e) => {
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
      setError("Information is incorrect.");
    }
  };

  return (
    <div className="flex items-start justify-center h-screen bg-gradient-to-r from-red-400 via-blue-500 to-purple-600">
      <div className="text-center mt-4 p-6 bg-white rounded-lg shadow-lg">
        <h1>Calorie Remaining</h1>
        <p>2890 - 200 = 2690: Your Calorie Goal edit here:</p>
        <form onSubmit={handleSubmit}>
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
            <div className="space-y-6 p-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Use this form to add a new food item to your list.
              </p>
              {/* Your form or content for adding food goes here */}
            </div>
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
            ? `Calories Left: ${profile.calories || "N/A"}`
            : "User is not authenticated"}
        </div>

        <p>Goal - Food = Remaining</p>
        <h2>Today's Day</h2>
        <div>The food will be rendered here</div>
        <div>Calories will be rendered here</div>
        <p>Paragraph for telling the people what these results mean.</p>
        <p>
          {profile
            ? JSON.stringify(profile, null, 2)
            : "User is not authenticated"}
        </p>
      </div>
    </div>
  );
};

export default MainPage;
