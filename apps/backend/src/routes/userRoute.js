import express from "express";
const userRoute = express.Router();
import {
  signupController,
  loginController,
} from "../controllers/userController";

userRoute.post("/signup", signupController);
userRoute.post("/login", loginController);
export default userRoute;
