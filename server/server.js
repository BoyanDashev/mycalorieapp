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

app.use(cors());

app.use(bodyParser.json());

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


// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use("/api", authRoutes);



