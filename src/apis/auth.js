const User = require("../models/user");

const registerUser = async (req, res) => {
  // Registration logic here
  const requestBody = req.body;

  const user = new User(requestBody);
  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user---", error.message);

    // Check if the error code is 11000 (Duplicate Key)
    if (error.code === 11000) {
      // Extract the field name that caused the conflict
      const duplicateField = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        message: `This ${duplicateField} is already in use.`,
        field: duplicateField,
      });
    }

    // Check if it's a Mongoose Validation Error
    if (error.name === "ValidationError") {
      // Extract the specific messages for each field (e.g., username, email)
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        status: "fail",
        message: `Invalid input data: ${messages.join(". ")}`,
      });
    }

    // Handle everything else (Generic errors)
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = registerUser;
