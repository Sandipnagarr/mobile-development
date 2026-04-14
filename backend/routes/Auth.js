const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
// create token here //
const createToken = (user) => {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";

  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    secret,
    { expiresIn: "7d" },
  );
};

router.post("/register",
  async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    // find the use is already exist or not based on the email
    const existingUser = await User.findOne({ email: normalizedEmail });
// if user exist than retun status with messege 
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }
   // hash passwoard 
    const hashedPassword = await bcrypt.hash(password, 10);


    const createuser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(createuser);

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      createuser: {
        id: createuser._id,
        email: createuser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Unable to register user.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Unable to login.",
    });
  }
});

module.exports = router;
/****
1.Setup basic Node.js server with Socket.IO for real-time communication
2.Implemented WebSocket connection between frontend and backend
3.Implemented real-time chat functionality between multiple users
4.Designed chat UI with message list using map and state management
5.Understood WebSocket flow (client → server → broadcast → client)
6.design a messege screen to send messege and recieve message with two users
7.implemented logoout in the page to redirect to login page
 * 
 * 
 * 
 * 
 * 
 * 
 */