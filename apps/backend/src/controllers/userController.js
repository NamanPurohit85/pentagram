import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { loginSchema, signupSchema } from "./userValidate";
const salt = Number(process.env.SALT);

const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(401).end("All fields are required");
    }
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).end("Email already exist");
    }

    let hashPassword = await bcrypt.hash(password, salt);
    user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    const payLoad = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payLoad, process.env.SECRET, { expiresIn: "6h" });
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).end("All fields are required");
    }

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(409).end("Invalid Credentials");
    }

    const payLoad = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payLoad, process.env.SECRET, { expiresIn: "6h" });
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.status(201).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const logoutController = (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export { signupController, loginController, logoutController };
