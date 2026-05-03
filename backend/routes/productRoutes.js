import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

/* =========================
   GET ALL ACTIVE PRODUCTS
========================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({
      isArchived: { $ne: true } // clean + reliable
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* =========================
   GET ARCHIVED PRODUCTS
========================= */
router.get("/archived", async (req, res) => {
  try {
    const products = await Product.find({
      isArchived: true
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch archived products" });
  }
});

/* =========================
   ADD PRODUCT
========================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image received" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Cloudinary failed" });
        }

        const product = await Product.create({
          name: req.body.name,
          price: Number(req.body.price),
          description: req.body.description || "",
          category: req.body.category,
          stock: Number(req.body.stock || 0),
          image: result.secure_url,
          isArchived: false, // 🔥 IMPORTANT DEFAULT
        });

        res.json(product);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

/* =========================
   ARCHIVE PRODUCT
========================= */
router.put("/:id/archive", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isArchived: true } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Archive failed" });
  }
});

/* =========================
   RESTORE PRODUCT
========================= */
router.put("/:id/restore", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isArchived: false } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Restore failed" });
  }
});

/* =========================
   RESTOCK
========================= */
router.put("/:id/restock", async (req, res) => {
  try {
    const { amount } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: Number(amount) } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Restock failed" });
  }
});

/* =========================
   UPDATE PRODUCT (WITH IMAGE)
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.image !== undefined) updateData.image = req.body.image;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

/* =========================
   PERMANENT DELETE PRODUCT
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;