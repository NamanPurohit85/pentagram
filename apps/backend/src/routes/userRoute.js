import express from "express";
const userRoute = express.Router();
import {
  signupController,
  loginController,
  logoutController,
} from "../controllers/userController";
import checkToken from "../middlewares/protectedRoute";

userRoute.post("/signup", signupController);
userRoute.post("/login", loginController);
userRoute.get("/logout", checkToken, logoutController);
export default userRoute;
