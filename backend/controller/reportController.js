import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const start = new Date(from);
    const end = new Date(to);

    // ✅ Get approved payments
    const approvedPayments = await Payment.find({
      status: "Approved",
      createdAt: { $gte: start, $lte: end },
    });

    const orderIds = approvedPayments.map(p => p.orderId);

    // ✅ Get related orders
    const orders = await Order.find({
      _id: { $in: orderIds },
    });

    // =========================
    // CALCULATIONS
    // =========================
    let totalRevenue = 0;
    let totalOrders = orders.length;
    let totalItemsSold = 0;

    const productMap = {};
    const dailySales = {};

    orders.forEach(order => {
      totalRevenue += order.total || 0;

      const date = order.createdAt.toISOString().split("T")[0];

      dailySales[date] = (dailySales[date] || 0) + order.total;

      order.items.forEach(item => {
        totalItemsSold += item.quantity;

        if (!productMap[item.name]) {
          productMap[item.name] = 0;
        }
        productMap[item.name] += item.quantity;
      });
    });

    // ✅ Top products
    const topProducts = Object.entries(productMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders,
      totalItemsSold,
      topProducts,
      dailySales,
      orders,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error generating report" });
  }
};