const express = require("express");
const userRoute = express.Router();
const {
  signupController,
  loginController,
} = require("../controllers/userController");

userRoute.post("/signup", signupController);
userRoute.post("/login", loginController);
module.exports = userRoute;
