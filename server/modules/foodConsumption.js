const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const FoodConsumption = mongoose.model(
  "FoodConsumption",
  foodConsumptionSchema
);

module.exports = FoodConsumption;
