import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import { getUserOrdersWithPayments } from "../controller/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadClaim.js";

const router = express.Router();

/* =========================
   CREATE ORDER (SECURED)
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      userId: req.user.id, // ✅ SECURE (from token)
      items,
      total,
      status: "Pending",
      compartment: "",
      compartmentPassword: "",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Order error", error: err.message });
  }
});

/* =========================
   SPECIAL ROUTE
========================= */
router.get("/user-with-payments/:userId", getUserOrdersWithPayments);

/* =========================
   GET USER ORDERS (SECURED VERSION)
========================= */
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("userId", "name email idImage");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch error" });
  }
});

/* =========================
   GET ALL ORDERS (ADMIN / INTERNAL)
========================= */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email idImage");

    const ordersWithPayments = await Promise.all(
      orders.map(async (order) => {
        const payment = await Payment.findOne({
          orderId: order._id,
          status: "Approved",
        });

        return {
          ...order.toObject(),
          paymentStatus: payment ? "Approved" : "Pending",
        };
      })
    );

    res.json(ordersWithPayments);
  } catch (err) {
    res.status(500).json({ message: "Fetch all orders error" });
  }
});

/* =========================
   UPDATE ORDER STATUS
========================= */
router.put("/:id/status", async (req, res) => {
  try {
    const { status, compartment } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* 🔒 BLOCK ANY CHANGES AFTER DELIVERED */
    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Order already delivered. Cannot update again.",
      });
    }

    /* PAYMENT CHECK */
    if (status === "Delivered") {
      const payment = await Payment.findOne({
        orderId: order._id,
        status: "Approved",
      });

      if (!payment) {
        return res.status(400).json({
          message: "Cannot deliver: Payment not approved",
        });
      }
    }

    /* STOCK DEDUCTION (ONLY ONCE) */
    if (status === "Delivered") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    /* PASSWORD GENERATION */
    if (!order.compartmentPassword && status === "Delivered") {
      order.compartmentPassword = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
    }

    order.status = status ?? order.status;

    if (compartment !== undefined) {
      order.compartment = compartment;
    }

    await order.save();

    // 🔥 populate + payment status
    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email idImage");

    const payment = await Payment.findOne({
      orderId: order._id,
      status: "Approved",
    });

    const finalOrder = {
      ...populatedOrder.toObject(),
      paymentStatus: payment ? "Approved" : "Pending",
    };

    res.json(finalOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Update failed",
      error: err.message,
    });
  }
});

/* =========================
   CANCEL ORDER (USER)
========================= */
router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ cannot cancel if already delivered
    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Cannot cancel delivered order",
      });
    }

    // ❌ cannot cancel if already paid
    const payment = await Payment.findOne({
      orderId: order._id,
      status: "Approved",
    });

    if (payment) {
      return res.status(400).json({
        message: "Cannot cancel paid order",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/claim", upload.single("image"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    order.claimProof =
      req.file?.path ||
      req.file?.secure_url ||
      req.file?.url;
    order.claimStatus = "Pending";
    order.claimSubmittedAt = new Date();

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: "Claim upload failed",
      error: err.message,
    });
  }
});

router.put("/:id/claim-status", async (req, res) => {
  try {
    const { claimStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["Approved", "Rejected"].includes(claimStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.claimStatus = claimStatus;

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: "Update claim failed",
      error: err.message,
    });
  }
});

export default router;