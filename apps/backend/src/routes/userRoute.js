import express from "express";
const userRoute = express.Router();
import {
  signupController,
  loginController,
  logoutController,
  followUserController,
  unfollowUserController,
  getUserProfileController,
  getAllUsersController,
  updateUserProfileController,
} from "../controllers/userController.js";
import checkToken from "../middlewares/protectedRoute.js";

userRoute.post("/signup", signupController);
userRoute.post("/login", loginController);
userRoute.get("/logout", checkToken, logoutController);
userRoute.get("/all", checkToken, getAllUsersController);
userRoute.post("/update", checkToken, updateUserProfileController);
userRoute.post("/follow/:id", checkToken, followUserController);
userRoute.post("/unfollow/:id", checkToken, unfollowUserController);
userRoute.get("/:id", getUserProfileController);
export default userRoute;
