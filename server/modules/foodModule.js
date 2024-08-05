const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the food schema
const foodSchema = new Schema({
  foodname: {
    type: String,
    
  },
  foodcalorie: {
    type: Number,
    
  },
  foodprotein: {
    type: Number,
    
  },
  foodsugar: {
    type: Number,
    
  },
  foodfat: {
    type: Number,
    
  },
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
