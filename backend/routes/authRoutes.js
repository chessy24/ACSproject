import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import multer from "multer";

const router = express.Router();

/* =========================
   MULTER SETUP
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   REGISTER (WITH ID IMAGE SUPPORT)
========================= */
router.post("/register", upload.single("idImage"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 SAFE CHECK (prevents crash)
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔥 ONLY RTU EMAILS ALLOWED
    if (!email.endsWith("@rtu.edu.ph")) {
      return res.status(400).json({
        message: "Only @rtu.edu.ph emails are allowed",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 HANDLE IMAGE (optional frontend upload)
    let idImage = "";

    if (req.file) {
      // If you use Cloudinary later, upload here
      idImage = "uploaded"; // placeholder (safe for now)
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      idImage, // 🔥 SAVE IMAGE FLAG
    });

    res.json({
      message: "User created successfully",
      user,
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({
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
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        idImage: user.idImage, // 🔥 IMPORTANT for cart restriction
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Login error",
      error: err.message,
    });
  }
});

/* =========================
   GET CURRENT USER
========================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, "secret123");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log("ME ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;