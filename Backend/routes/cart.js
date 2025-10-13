const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartcontroller');

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeCartItem);

module.exports = router;
