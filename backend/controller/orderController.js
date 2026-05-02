import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

/* =========================
   CREATE ORDER (SAFE)
========================= */
export const createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // 🔥 VALIDATE STOCK FIRST
    for (let item of items) {
      const product = await Product.findById(item.productId).populate("stock");

      if (!product || !product.stock) {
        return res.status(400).json({
          message: `Product not found`
        });
      }

      if (item.quantity > product.stock.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }
    }

    // 🔥 DEDUCT STOCK
    for (let item of items) {
      const product = await Product.findById(item.productId).populate("stock");

      await Stock.findByIdAndUpdate(product.stock._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    // ✅ CREATE ORDER
    const newOrder = new Order({
      userId,
      items,
      total,
      status: "Pending"
    });

    await newOrder.save();

    res.status(201).json(newOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   GET USER ORDERS + PAYMENTS
========================= */
export const getUserOrdersWithPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    const payments = await Payment.find({ userId });

    const merged = orders.map((order) => {
      const payment = payments.find(
        (p) => p.orderId.toString() === order._id.toString()
      );

      return {
        ...order.toObject(),
        payment: payment || null,
      };
    });

    res.json(merged);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};