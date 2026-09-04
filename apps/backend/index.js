import "./setupEnv.js";

import connectDB from "./src/config/db.js";
import userRoute from "./src/routes/userRoute.js";
import blogRoute from "./src/routes/blogRoute.js";
import commentRoute from "./src/routes/commentRoute.js";
import express from "express";
import { app, server } from "./src/config/socket.js";
import cookieParser from "cookie-parser";
import cors from "cors";

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT;
if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

import messageRoute from "./src/routes/messageRoute.js";

app.use("/api/auth", userRoute);
app.use("/api/posts", blogRoute);
app.use("/api/posts/:postId/comments", commentRoute);
app.use("/api/message", messageRoute);

const start = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server Started at port ${port}`);
    });
  } catch (error) {
    console.log("Server failed to start", error);
  }
};
start();
