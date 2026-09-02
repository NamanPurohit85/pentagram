import connectDB from "./src/config/db";
import userRoute from "./src/routes/userRoute";
import blogRoute from "./src/routes/blogRoute";
// import commentRoute from "./src/routes/commentRoute";
import express from "express";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server Started at port ${port}`);
    });
  } catch (error) {
    console.log("Server failed to start", error);
  }
};
start();

app.use("/user", userRoute);
app.use("/blog", blogRoute);
// app.use("/comment", commentRoute);
