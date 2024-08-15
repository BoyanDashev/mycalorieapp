require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Add this line
const app = express();
const port = process.env.PORT || 5000;
const User = require("./modules/module");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const allowedOrigins = require("./config/allowedOrigins");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

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
  console.log(`Connected to database: ${mongoose.connection.name}`);
  console.log(`Connection host: ${mongoose.connection.host}`);
});

// API Routes
app.use("/api", authRoutes);

// Serve static files from the React app's build directory in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  // All other routes should return the React app
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html"),
      (err) => {
        if (err) {
          res.status(500).send("Internal Server Error");
        }
      }
    );
  });
}

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port: ${port}`);
});
