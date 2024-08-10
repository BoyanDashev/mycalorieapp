const express = require("express");
const router = express.Router();
const User = require("../modules/module");
const Food = require("../modules/foodModule");
const FoodConsumption = require("../modules/foodConsumption");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { getUserFoodHistory } = require("../services/foodServices"); // Import the service function

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

router.use(cookieParser()); // Make sure to use cookieParser middleware

// Registration route
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

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
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

// Check authentication route
router.get("/check", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.json({ authenticated: false });

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.json({ authenticated: false });
    res.json({ authenticated: true });
  });
});

// Middleware to authenticate JWT token
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

    // Fetch the user details by ID
    const user = await User.findById(userId).select("name height weight"); // Select only specific fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data as response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error); // Log the error details
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

// Route to get user details with populated foods
router.get("/mainpage", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId); // Populate foods

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error); // Log the error details
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile information
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

// tuka трябва да стане такаче да взима от усер консумпион датабазата а не от усер фоодс релацията.

router.post("/food", authenticateToken, async (req, res) => {
  try {
    // Destructure and validate input fields
    const { foodname, foodcalorie, foodprotein, foodsugar, foodfat } = req.body;

    if (!foodname || !foodcalorie || !foodprotein || !foodsugar || !foodfat) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new food item
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
    console.error("Error adding food item:", error); // Log the error details
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Perform search
    const foods = await Food.find({
      foodname: { $regex: query, $options: "i" }, // Case-insensitive search
    });

    res.status(200).json(foods);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/food-consumption", authenticateToken, async (req, res) => {
  const { foodId, date, quantity } = req.body;
  const userId = req.user.id; // Get userId from the authenticated user

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
  const userId = req.user.id; // Assume this is populated by your authenticateToken middleware
  const itemId = req.body.id; // ID of the food consumption entry to delete (from the request body)

  try {
    // Find and delete the specific food consumption entry for the authenticated user
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



// Fetch food consumption history for the authenticated user
router.get("/food-consumption", authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get userId from the authenticated user

  try {
    // Calculate start and end of today
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Start of today (midnight)
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // End of today (just before midnight)

    // Fetch food consumption data for today
    const foodHistory = await getUserFoodHistory(userId, startOfDay, endOfDay); // Pass dates to service function

    res.json(foodHistory);
  } catch (error) {
    res.status(400).json({ error: "Unable to fetch food consumption history" });
  }
});


// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send("Logged out");
});

module.exports = router;
