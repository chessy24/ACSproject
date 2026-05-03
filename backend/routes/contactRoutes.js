import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

/* =====================
   SAVE MESSAGE (USER)
===================== */
router.post("/", async (req, res) => {
  try {
    let { name, email, message } = req.body;

    // ✅ Trim inputs (important)
    name = name?.trim();
    email = email?.trim();
    message = message?.trim();

    // ✅ Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Optional: email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const newMessage = await Contact.create({
      name,
      email,
      message,
    });

    res.json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
});

/* =====================
   GET ALL (ADMIN)
===================== */
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default router;