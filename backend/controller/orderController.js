import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";

/* =========================
   CREATE ORDER (EMBEDDED STOCK)
========================= */
export const createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // ✅ 1. CHECK STOCK FIRST
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }
    }

    // ✅ 2. DEDUCT STOCK
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ 3. CREATE ORDER
    const newOrder = new Order({
      userId,
      items,
      total,
      status: "Pending",
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