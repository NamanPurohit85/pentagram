import express from "express";
const commentRoute = express.Router();
import {} from "../controllers/commentController";
import checkToken from "../middlewares/protectedRoute";

commentRoute.post("/comment", checkToken, );
export default commentRoute;