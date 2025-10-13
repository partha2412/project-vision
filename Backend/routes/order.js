const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const { protect, adminOnly } = require('../middleware/authmiddleware');

// example: /api/order/
router.get('/', protect, adminOnly, orderController.getAllOrders);
// example: /api/order/placeorder
router.post('/placeorder', protect, orderController.placeOrder);
// example: /api/order/status/:orderId
    // paidAt,
    // isDelivered,
    // deliveredAt,
    // trackingNumber,
    // notes,
    // status,
    // isPaid,
    router.put('/status/:orderId', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
