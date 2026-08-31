import connectDB from "./src/config/db";
import userRoute from "./src/routes/userRoute";
import express from "express";
const app = express();
app.use(express.json());
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
