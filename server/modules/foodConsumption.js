const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the food consumption schema
const foodConsumptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  foodId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Food",
  },
  date: {
    type: Date,
    default: Date.now,
  }, // Track when the food was eaten
  quantity: {
    type: Number,
    default: 1,
  }, // Track quantity or servings
});

const FoodConsumption = mongoose.model(
  "FoodConsumption",
  foodConsumptionSchema
);

module.exports = FoodConsumption;
