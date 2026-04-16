const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.error("Error fetching users---", error.message);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

const findUserByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
      message: "User found successfully",
    });
  } catch (error) {
    console.error("Error finding user by username---", error.message);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  // Update logic here
  const userId = req.params.id;
  const reqData = req.body;
  const notAllowedFields = ["email"]; // Fields that should not be updated;
  const isUpdateAllowed = Object.keys(reqData).every(
    (field) => !notAllowedFields.includes(field),
  );
  try {
    if (!isUpdateAllowed) {
      return res.status(400).json({
        status: "fail",
        message:
          "Updates to the following fields are restricted: " +
          notAllowedFields.join(", "),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, reqData, {
      new: true, // Returns the modified document rather than the original
      runValidators: true, // Crucial: ensures your Schema validations (regex, validate etc.) still run!
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user---", error.message);
    const statusCode =
      error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500;

    res.status(statusCode).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { getAllUsers, findUserByUsername, updateUser };
