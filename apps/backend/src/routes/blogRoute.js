import express from "express";
const blogRoute = express.Router();
import {
  createBlogController,
  getAllBlogController,
  updateBlogController,
  deleteBlogController,
  likeBlogController,
} from "../controllers/blogController.js";

import checkToken from "../middlewares/protectedRoute.js";
import upload from "../middlewares/multer.js";

blogRoute.post("/create", checkToken, upload.single("image"), createBlogController);
blogRoute.get("/allblog", checkToken, getAllBlogController);
blogRoute.post("/updateblog/:id", checkToken, updateBlogController);
blogRoute.get("/delete/:id", checkToken, deleteBlogController);
blogRoute.post("/like/:id", checkToken, likeBlogController);

export default blogRoute;
