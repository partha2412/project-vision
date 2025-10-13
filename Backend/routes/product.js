const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Product = require('../models/Product');

// Add product
router.post('/add', productController.addProduct);

// Update product by name
// Update product by name
router.put('/update/name/:productName', productController.updateProductByName);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
});

module.exports = router;
