import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const getUserOrdersWithPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. get orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // 2. get payments
    const payments = await Payment.find({ userId });

    // 3. merge manually
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