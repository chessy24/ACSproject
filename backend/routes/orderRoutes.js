import express from "express";
import mongoose from "mongoose";
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

    const order = await Order.create({
      userId,
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
   GET USER ORDERS
========================= */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("userId", "name email idImage");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch error" });
  }
});

/* =========================
   GET ALL ORDERS (ADMIN)
   + PAYMENT STATUS FIX
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

    /* PASSWORD */
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

    // 🔥 populate + paymentStatus (keep your UI consistent)
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

export default router;