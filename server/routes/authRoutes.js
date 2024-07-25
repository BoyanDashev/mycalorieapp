const router = require("express").Router();
let User = require("../modules/module.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

require("dotenv").config();



const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;


// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    console.log("User created successfully", user);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
   
    //jwt token

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, accessToken, { expiresIn: "1h" });
    res.cookie("authToken", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

// Protected route example
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;