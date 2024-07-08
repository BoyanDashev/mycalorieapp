const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;

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
