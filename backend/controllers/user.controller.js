import User from "../models/user.model.js";
import { generateToken } from "../utils/genToken.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const genSalt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(500).json({ message: "User registration failed" });
    }

    await generateToken(newUser._id, res);
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "User Registration Failed" });
    console.log("Error in register user component", error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    await generateToken(existingUser._id, res);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(400).json({ message: "User Login Failed" });
    console.log("Error in login user component", error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: "User Logout Failed" });
    console.log("Error in logout user component", error);
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not authenticated" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Getting User Details Failed" });
    console.log("Error in get user component", error);
  }
};
