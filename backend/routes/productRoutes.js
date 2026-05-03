import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

/* =========================
   GET ALL PRODUCTS (NOT ARCHIVED)
========================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isArchived: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
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
   ARCHIVE PRODUCT (REPLACES DELETE)
========================= */
router.put("/:id/archive", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Archive failed" });
  }
});

/* =========================
   RESTORE PRODUCT (OPTIONAL)
========================= */
router.put("/:id/restore", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
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
      {
        $inc: { stock: Number(amount) }
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Restock failed" });
  }
});

/* =========================
   UPDATE PRODUCT DETAILS + IMAGE
========================= */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
    };

    // ✅ IF NEW IMAGE PROVIDED → UPLOAD
    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Cloudinary failed" });
          }

          updateData.image = result.secure_url;

          const updated = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
          );

          return res.json(updated);
        }
      );

      return streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    }

    // ✅ NO IMAGE UPDATE
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;