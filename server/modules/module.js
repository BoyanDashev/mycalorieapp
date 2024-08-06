const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
    },
    height: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    calorie: {
      type: Number,
      min: 0,
      default: 2000,
    },
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }], // Reference to Food schema
  },
  {
    timestamps: true,
  }
);

// трябва да може да се направи, такаче да има две схеми и едната да се приема като масив в другата например
// const userSchema = new Schema({
// foods: [FoodsSchema]});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

// Create the model
const User = mongoose.model("User", userSchema);

module.exports = User;
