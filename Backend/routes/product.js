const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Product = require('../models/Product');

// Add product
router.post(
  '/add',
  productController.uploadMiddleware, // multer middleware
  productController.addProduct
);
// Update product by name
// Update product by name
router.put('/update/:id', productController.updateProductById);

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

// Search products by title/description
// example: /api/product/search?query=phone
router.get('/search', productController.searchProducts);

// Get products within price range
// example: /api/product/range?min=100&max=500
router.get('/range', productController.getProductsByRange);


// product delete (soft delete)
// example: /api/product/delete/soft/:id
router.delete('/delete/soft/:id', productController.softDeleteProduct);

// Hard delete
// example: /api/product/delete/hard/:id
router.delete('/delete/hard/:id', productController.hardDeleteProduct);

module.exports = router;
