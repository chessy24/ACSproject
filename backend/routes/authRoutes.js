import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

/* =========================
   CLOUDINARY MULTER SETUP
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_ids",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

/* =========================
   REGISTER
========================= */
router.post("/register", upload.single("idImage"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!email.endsWith("@rtu.edu.ph")) {
      return res.status(400).json({
        message: "Only @rtu.edu.ph emails are allowed",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❗ FORCE ID UPLOAD
    if (!req.file) {
      return res.status(400).json({
        message: "ID image is required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      idImage: req.file.path, // ✅ CLOUDINARY URL
    });

    // 🔥 CREATE TOKEN (FIX FOR YOUR LOGIN ISSUE)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "secret123",
      { expiresIn: "5min" }
    );

    return res.status(201).json({
      message: "User created successfully",
      token, // ✅ FIXED (auto login after register)
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        idImage: user.idImage,
      },
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.status(500).json({
      message: "Register error",
      error: err.message,
    });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "secret123",
      { expiresIn: "5min" }
    );

    return res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        idImage: user.idImage,
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Login error",
      error: err.message,
    });
  }
});

/* =========================
   GET CURRENT USER (/me)
========================= */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secret123");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      idImage: user.idImage,
    });

  } catch (err) {
    console.log("ME ERROR:", err);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});

export default router;