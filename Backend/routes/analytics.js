const express = require("express");
const router = express.Router();
const { getSalesOverview, getRevenueByCategory, getOrdersDistribution } = require("../controllers/analyticsController");

router.get("/sales", getSalesOverview);
router.get("/revenue-by-category", getRevenueByCategory);
router.get("/orders-status", getOrdersDistribution);

module.exports = router;
