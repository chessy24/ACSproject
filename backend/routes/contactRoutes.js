import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

/* =====================
   SAVE MESSAGE (USER)
===================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = await Contact.create({
      name,
      email,
      message,
    });

    res.json({ message: "Message sent", data: newMessage });
  } catch (err) {
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