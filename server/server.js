const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://your-production-client-url.com",
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const uri = "mongodb://localhost:27017/my-app";

mongoose.connect(uri, {
//   useNewUrlParser: true, // Remove this option, as it's deprecated
//   useUnifiedTopology: true, // Remove this option, as it's deprecated
});

const connection = mongoose.connection;
connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Example API route
const exampleRouter = require("./routes/route");
app.use("/api/route", exampleRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
