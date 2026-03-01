const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

// 1️⃣ Sales Overview (monthly revenue)
exports.getSalesOverview = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const formatted = sales.map((s) => ({
      month: new Date(new Date().getFullYear(), s._id - 1).toLocaleString("default", { month: "short" }),
      revenue: s.revenue,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️⃣ Revenue by Category
exports.getRevenueByCategory = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      {
        $group: {
          _id: "$productData.category",
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json(data.map((d) => ({ category: d._id, revenue: d.revenue })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3️⃣ Orders Distribution by status
exports.getOrdersDistribution = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
    ]);

    res.json(data.map((d) => ({ name: d._id, value: d.value })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
