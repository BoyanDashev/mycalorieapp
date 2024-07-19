const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const User = require("./modules/module"); 
const authRoutes = require("./routes/authRoutes")

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://your-production-client-url.com",
];

app.use(express.json());


// CORS options
//  

// Use CORS middleware
// app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/my-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const connection = mongoose.connection;
connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
   console.log(`Connected to database: ${mongoose.connection.name}`);
   console.log(`Connection host: ${mongoose.connection.host}`);
});

// Example API route
// const exampleRouter = require("./routes/authRoutes");
// app.use("/api/route", exampleRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use("/api", authRoutes);

// Register a new user
// app.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const newUser = new User({ username, password });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Login a user
// app.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid username or password' });
//     }
//     const isMatch = await user.isValidPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid username or password' });
//     }
//     res.status(200).json({ message: 'Login successful!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

