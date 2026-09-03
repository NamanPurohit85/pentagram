import express from "express";
const commentRoute = express.Router();
import { createCommentController, getCommentsController, deleteCommentController } from "../controllers/commentController.js";
import checkToken from "../middlewares/protectedRoute.js";

commentRoute.post("/:blogId", checkToken, createCommentController);
commentRoute.get("/:blogId", checkToken, getCommentsController);
commentRoute.delete("/:id", checkToken, deleteCommentController);

export default commentRoute;