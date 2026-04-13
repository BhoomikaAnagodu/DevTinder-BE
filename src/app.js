const express = require("express");
const app = express();
const port = 3000;

const connectDB = require("./config/database");
const registerUser = require("./apis/auth");

// Middleware to parse JSON bodies
app.use(express.json());

// Authentication route
app.post("/register", registerUser);

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(port, () => {
      console.log(`Server running on port --- ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
