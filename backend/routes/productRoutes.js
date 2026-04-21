import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

/* =========================
   GET ALL PRODUCTS
========================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* =========================
   ADD PRODUCT (FIXED + SAFE)
========================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No image received" });
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (error, result) => {
        if (error) {
          console.log("CLOUDINARY ERROR:", error);
          return res.status(500).json({ error: "Cloudinary failed" });
        }

        console.log("CLOUDINARY RESULT:", result);

        // 🔥 IMPORTANT: WAIT FOR DB SAVE INSIDE CALLBACK
        const product = await Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description || "", // 🔥 FIX SAFE
          category: req.body.category,

         // 🔥 ADD THIS
  stock: Number(req.body.stock || 0),


          image: result.secure_url
        });

        return res.json(product);
      }
    );

    // PIPE FILE
    streamifier.createReadStream(req.file.buffer).pipe(uploadResult);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   UPDATE PRODUCT (RESTOCK / EDIT)
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          category: req.body.category,
          stock: req.body.stock,
        },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;