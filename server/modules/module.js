const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;


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
    }
  },
  {
    timestamps: true, 
  }
);


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
