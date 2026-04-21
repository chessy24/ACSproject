import express from "express";
import Payment from "../models/Payment.js";
import upload from "../middleware/upload.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

/* GCASH PAYMENT WITH IMAGE UPLOAD */
router.post("/gcash", upload.single("proof"), async (req, res) => {
  try {
    const { orderId, userId, name, reference } = req.body;

    console.log("BODY:", req.body);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "proof image is required" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "gcash_proofs" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const payment = await Payment.create({
      orderId,
      userId,
      name,
      reference,
      proof: result.secure_url,
    });

    res.json(payment);

  } catch (err) {
    console.log("GCASH ROUTE ERROR:", err);
    res.status(500).json({ message: "Payment upload error" });
  }
});

/* ADMIN GET ALL PAYMENTS */
router.get("/", async (req, res) => {
  const payments = await Payment.find().populate("orderId");
  res.json(payments);
});

// UPDATE PAYMENT STATUS
router.put("/:id", async (req, res) => {
  try {
    const { status, rejectReason } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        rejectReason: status === "Rejected" ? rejectReason : "",
      },
      { new: true }
    );

    res.json(updatedPayment);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;