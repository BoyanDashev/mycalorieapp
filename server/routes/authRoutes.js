const router = require("express").Router();
const User = require("../modules/module.js");
const Food = require("../modules/foodModule.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

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
    const user = await User.findById(userId).select('name height weight'); // Select only specific fields

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


// Route to get user details with populated foods
router.get("/mainpage", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("foods"); // Populate foods

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "This is a protected route", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Route to add food item
router.post("/food", authenticateToken, async (req, res) => {
  try {
    const { foodname, foodcalorie, foodprotein, foodsugar, foodfat } = req.body;

    // Create new food item
    const newFood = new Food({
      foodname,
      foodcalorie,
      foodprotein,
      foodsugar,
      foodfat,
    });
    await newFood.save();

    // Add food item to the user's foods array
    const userId = req.user.id;
    await User.findByIdAndUpdate(
      userId,
      { $push: { foods: newFood._id } },
      { new: true, runValidators: true }
    );

    // Find the updated user and populate the foods field
    const updatedUser = await User.findById(userId).populate("foods");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Food item added successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send("Logged out");
});

module.exports = router;
