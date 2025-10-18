const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const { protect, adminOnly } = require('../middleware/authmiddleware');

// example: /api/order/
router.get('/', protect, adminOnly, orderController.getAllOrders);
// example: /api/order/placeorder
router.post('/create', protect, orderController.placeOrder);
// example: /api/order/status/:orderId
// paidAt,
// isDelivered,
// deliveredAt,
// trackingNumber,
// notes,
// status,
// isPaid,

// delete order (admin only)
router.delete('/deleteorder/:orderId', protect, adminOnly, orderController.deleteOrder);

// update order status (admin only)
router.put('/status/:orderId', protect, adminOnly, orderController.updateOrderStatus);

// example: /api/order/user/:userId
router.get('/user/:userId', orderController.getUserOrders);  // GET /api/orders/user/:userId

module.exports = router;
