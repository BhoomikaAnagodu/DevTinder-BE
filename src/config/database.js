const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://bhoomikaanagodu_db:oWgOH9edZrvsDFi9@learnnodejs2026.1dgzvox.mongodb.net/devTinder",
  );
};

module.exports = connectDB;


