const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const User = require("./modules/module");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");



app.use(cookieParser());

app.use(express.json());

app.use(cors());

app.use(bodyParser.json());

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
  console.log(`Connected to database: ${mongoose.connection.name}`);
  console.log(`Connection host: ${mongoose.connection.host}`);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use("/api", authRoutes);
