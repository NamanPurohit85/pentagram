import mongoose from "mongoose";
const url = process.env.URL;

const connectDB = async () => {
  await mongoose.connect(url);
  console.log("Mongo DB connected");
};

export default connectDB;
