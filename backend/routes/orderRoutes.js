import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import { getUserOrdersWithPayments } from "../controller/orderController.js";

const router = express.Router();

/* =========================
   CREATE ORDER
========================= */
router.post("/", async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // 🔥 generate 4-digit password here
    const generatePassword = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const order = await Order.create({
      userId,
      items,
      total,
      compartmentPassword: ""
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Order error", err });
  }
});

/* =========================
   SPECIAL ROUTE (PUT THIS FIRST)
========================= */
router.get("/user-with-payments/:userId", getUserOrdersWithPayments);

/* =========================
   GET USER ORDERS
========================= */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("userId", "name email"); // 🔥 ADD USER NAME HERE

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch error" });
  }
});

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); // 🔥 ADD USER NAME HERE

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch all orders error" });
  }
});

/* =========================
   UPDATE ORDER STATUS (ADMIN)
========================= */
router.put("/:id/status", async (req, res) => {
  try {
    const { status, compartment } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // =========================
    // 🔒 BLOCK DELIVERY IF NOT PAID
    // =========================
    if (status === "Delivered") {
      const payment = await Payment.findOne({
        orderId: order._id,
        status: "Approved", // ✅ FILTER HERE
      });

      if (!payment || payment.status !== "Approved") {
        return res.status(400).json({
          message: "Cannot deliver: Payment not approved",
        });
      }
    }

    // =========================
    // 📦 STOCK DEDUCTION (SAFE NOW)
    // =========================
    if (status === "Delivered" && order.status !== "Delivered") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // =========================
    // 🔐 PASSWORD GENERATION
    // =========================
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

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

export default router;