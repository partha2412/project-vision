const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartcontroller.js');
const { protect } = require('../middleware/authmiddleware.js');

// All routes are protected
router.use(protect);

// Add product to cart
router.post('/add', cartController.addToCart);

// Get user's cart
router.get('/', cartController.getCart);

// Update quantity of a product
router.put('/update', cartController.updateCartItem);

// Increment / Decrement quantity
router.put('/change-quantity', cartController.changeCartItemQuantity);

// Remove product from cart
router.delete('/remove/:productId', cartController.removeCartItem);

// Clear entire cart
router.delete('/clear' , cartController.clearCart);

module.exports = router;
