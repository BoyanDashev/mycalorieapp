const express = require("express");
const router = express.Router();
const User = require("../modules/module");
const Food = require("../modules/foodModule");
const FoodConsumption = require("../modules/foodConsumption");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { getUserFoodHistory } = require("../services/foodServices");

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

router.use(cookieParser());

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    console.log("User created successfully", user);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, accessToken, { expiresIn: "1h" });
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/check", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.json({ authenticated: false });

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.json({ authenticated: false });
    res.json({ authenticated: true });
  });
});

function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("name height weight");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/mainpage", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { calorie } = req.body;
    if (!calorie) {
      return res
        .status(400)
        .json({ message: "There is an error with the input." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { calorie },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mainpage", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, height, weight } = req.body;
    if (!name || !height || !weight) {
      return res
        .status(400)
        .json({ message: "There is an error with the input." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, height, weight },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/food", authenticateToken, async (req, res) => {
  try {
    const { foodname, foodcalorie, foodprotein, foodsugar, foodfat } = req.body;

    if (!foodname || !foodcalorie || !foodprotein || !foodsugar || !foodfat) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newFood = new Food({
      foodname,
      foodcalorie,
      foodprotein,
      foodsugar,
      foodfat,
    });

    await newFood.save();

    res.status(201).json({
      message: "Food item added successfully",
      food: newFood,
    });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const foods = await Food.find({
      foodname: { $regex: query, $options: "i" },
    });

    res.status(200).json(foods);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/food-consumption", authenticateToken, async (req, res) => {
  const { foodId, date, quantity } = req.body;
  const userId = req.user.id;

  try {
    const foodConsumption = new FoodConsumption({
      userId,
      foodId,
      date,
      quantity,
    });
    await foodConsumption.save();
    res.status(201).send(foodConsumption);
  } catch (error) {
    res.status(400).send({ error: "Unable to log food consumption" });
  }
});

router.delete("/food-consumption", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const itemId = req.body.id;

  try {
    const result = await FoodConsumption.deleteOne({
      _id: itemId,
      userId: userId,
    });

    res
      .status(200)
      .json({ message: "Food consumption entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete food consumption entry" });
  }
});

router.get("/food-consumption", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const foodHistory = await getUserFoodHistory(userId, startOfDay, endOfDay);

    res.json(foodHistory);
  } catch (error) {
    res.status(400).json({ error: "Unable to fetch food consumption history" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send("Logged out");
});

module.exports = router;
