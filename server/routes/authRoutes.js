const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../modules/module.js"); // Adjust the path to your model

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
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      "your_jwt_secret_key", // Replace with your actual JWT secret key
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      "your_refresh_token_secret_key", // Replace with your actual refresh token secret key
      { expiresIn: "7d" }
    );

    // Optionally, store refresh tokens in the database here

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Refresh token route (optional, if using refresh tokens)
router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, "your_refresh_token_secret_key", (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if the token is invalid

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, "your_jwt_secret_key", (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden if token is invalid
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized if no token is provided
  }
};

// Example protected route
router.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

module.exports = router;
