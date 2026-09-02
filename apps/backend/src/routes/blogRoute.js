import express from "express";
const blogRoute = express.Router();
import {
  createBlogController,
  getAllBlogController,
  updateBlogController,
  deleteBlogController,
} from "../controllers/blogController";

import checkToken from "../middlewares/protectedRoute";

blogRoute.post("/create", checkToken, createBlogController);
blogRoute.get("/allblog", checkToken, getAllBlogController);
blogRoute.post("/updateblog/:id", checkToken, updateBlogController);
blogRoute.get("/delete/:id", checkToken, deleteBlogController);

export default blogRoute;
