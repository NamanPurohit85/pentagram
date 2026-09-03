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
const port = process.env.PORT || 5000;

import messageRoute from "./src/routes/messageRoute.js";

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/comment", commentRoute);
app.use("/message", messageRoute);

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
