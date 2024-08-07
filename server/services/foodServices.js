
const FoodConsumption = require("../modules/foodConsumption");
const User = require("../modules/module");

// Fetch a user's food consumption history
const getUserFoodHistory = async (userId, startDate, endDate) => {
  try {
    const foodHistory = await FoodConsumption.find({
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("foodId") // Populate the food details
      .exec();

    return foodHistory;
  } catch (error) {
    console.error("Error fetching food history:", error);
    throw error;
  }
};

module.exports = { getUserFoodHistory };

