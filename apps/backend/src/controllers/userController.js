const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const salt = process.env.SALT;

const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(401).end("All fields are required");
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
      message: "Signup successful",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).end("All fields are required");
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
      message: "Login successful",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { signupController, loginController };
