const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Usernames can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and symbol",
      },
      // Use select: false so password isn't sent in queries by default
      select: false,
    },
    age: { type: Number, min: [10, "You must be at least 10 years old"] },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a supported gender",
      },
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "No bio provided.",
    },
    profilePicture: {
      type: String,
      validate: {
        validator: (value) => !value || validator.isURL(value),
        message: "Profile picture must be a valid URL",
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 20; // If the function returns true, the data is saved
        },
        message: "You can list up to 20 skills",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for geo-spatial queries (useful if you want to find nearby users)
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
