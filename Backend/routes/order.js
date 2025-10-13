const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const { protect, adminOnly } = require('../middleware/authmiddleware');


router.get('/', protect, adminOnly, orderController.getAllOrders);

module.exports = router;
