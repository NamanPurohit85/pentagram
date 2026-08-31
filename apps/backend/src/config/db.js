const mongoose = require("mongoose");
const url = process.env.URL;

const connectDB = async () => {
  await mongoose.connect(url);
  console.log("Mongo DB connected");
};

module.exports = connectDB;
