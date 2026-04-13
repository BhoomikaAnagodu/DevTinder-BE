const mongoose = require("mongoose");

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

      validate: [
        {
          // 1. Complexity Check (Regex) This Regex requires: 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character
          validator: function (value) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              value,
            );
          },
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
        {
          // 2. Personal Info & Common Words Check
          validator: function (value) {
            const passwordLower = value.toLowerCase();
            const firstNameLower = this.firstName
              ? this.firstName.toLowerCase()
              : "";

            return (
              !passwordLower.includes("password") &&
              (firstNameLower === "" || !passwordLower.includes(firstNameLower))
            );
          },
          message:
            "Password cannot contain the word 'password' or your first name",
        },
      ],
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
    skills: [String],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        validate: {
          validator: (coords) => coords.length === 2,
          message: "Coordinates must be [longitude, latitude]",
        },
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
