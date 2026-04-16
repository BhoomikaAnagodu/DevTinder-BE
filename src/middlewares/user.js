const mongoose = require("mongoose");

const validateUserId = (req, res, next) => {
  const userId = req.params?.id || req.body?.id; // Check both params and body for user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid User ID format",
    });
  }
  next();
};

module.exports = { validateUserId };
