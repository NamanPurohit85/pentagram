require("dotenv").config;
const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT;

const connectDB = require("./src/config/db");

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server Started at port ${port}`);
    });
  } catch (error) {
    console.log("Server failed to start", error);
  }
};
start();

const userRoute = require("./src/routes/userRoute");
app.use("/user", userRoute);
