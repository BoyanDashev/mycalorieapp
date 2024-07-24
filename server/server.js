const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");

// Load environment variables from .env file
dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // Read allowed origins from environment variable
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
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
});

// Route handling
app.use("/api", authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
