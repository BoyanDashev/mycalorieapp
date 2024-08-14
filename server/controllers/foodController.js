const { getUserFoodHistory } = require("../services/foodServices");

const fetchFoodHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const foodHistory = await getUserFoodHistory(userId);
    res.json(foodHistory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch food consumption history." });
  }
};

module.exports = { fetchFoodHistory };
