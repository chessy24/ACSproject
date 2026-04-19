import express from "express";
import Order from "../models/Order.js";
import { getUserOrdersWithPayments } from "../controller/orderController.js"
import Product from "../models/Product.js";

const router = express.Router();

/* CREATE ORDER */
router.post("/", async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    const order = await Order.create({
      userId,
      items,
      total,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Order error", err });
  }
});

/* GET USER ORDERS */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch error" });
  }
});

/* GET ALL ORDERS (ADMIN) */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch all orders error" });
  }
});

// UPDATE ORDER STATUS (ADMIN)
router.put("/:id/status", async (req, res) => {
  try {
    const { status, compartment, compartmentPassword } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 STOCK DEDUCTION (ONLY ONCE WHEN DELIVERED)
    if (status === "Delivered" && order.status !== "Delivered") {
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }
}

    order.status = status ?? order.status;

    if (compartment !== undefined) {
      order.compartment = compartment;
    }

    if (compartmentPassword !== undefined) {
      order.compartmentPassword = compartmentPassword;
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

router.get("/user-with-payments/:userId", getUserOrdersWithPayments);

export default router;