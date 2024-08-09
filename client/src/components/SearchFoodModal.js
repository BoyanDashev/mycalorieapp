import React, { useState } from "react";
import { Button, Modal, Label, TextInput } from "flowbite-react";
import axios from "axios";

function SearchFoodModal({ openOtherModal, setOtherModal }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

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
    <Modal show={openOtherModal} onClose={() => setOtherModal(false)}>
      <Modal.Header>Search Already Existing Food Item</Modal.Header>
      <Modal.Body>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Use this form to search for a Food Item.
        </p>
        <div className="flex max-w-md flex-col gap-4">
          <div className="mb-2 block">
            <Label htmlFor="food-search" color="failure" value="Food Search" />
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
          className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Search Food
        </Button>
        {error && <p className="text-red-500">{error}</p>}
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
          onClick={() => setOtherModal(false)}
          className="w-md mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchFoodModal;
