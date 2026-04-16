const express = require("express");
const app = express();
const port = 3000;

const connectDB = require("./config/database");
const { registerUser, deleteUser } = require("./apis/auth");
const { getAllUsers, findUserByUsername, updateUser } = require("./apis/user");
const { validateUserId } = require("./middlewares/user");

// Middleware to parse JSON bodies
app.use(express.json());

// Authentication route
app.post("/register", registerUser);

// User deletion route
app.delete("/user/:id", validateUserId, deleteUser);

// User route
app.get("/users", getAllUsers);
app.get("/user/:username", findUserByUsername);
app.patch("/user/:id", validateUserId, updateUser);

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
