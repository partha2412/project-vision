const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const Product = require('../models/Product');
const { filterProductsByPrice } = require("../controllers/productController.js");
//short 
router.get("/filter", filterProductsByPrice);

//all buttons products
router.get("/all", productController.getAllProducts);
router.get("/category/:category", productController.getProductsByCategory);
// Add product
router.post(
  '/add',
  productController.uploadMiddleware, // multer middleware
  productController.addProduct
);
// Add Bulk
router.post('/add_bulk', productController.bulkUploadMiddleware , productController.addbulkProduct);

// Update product by name
router.put(
  '/update/:id',
  productController.uploadMiddleware, // multer middleware
  productController.updateProductById
);


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

// Sort products by price
// example: /api/product/sort?order=asc or /api/product/sort?order=desc
router.get('/sort', productController.getSortedProducts);


// Get product by ID
router.get('/:id', productController.getProductById);


// Trending products
router.get('/trending', productController.getTrendingProducts);

// Best Rating products
router.get('/best-rating', productController.getBestRatingProducts);

// Best Seller products
router.get('/best-seller', productController.getBestSellerProducts);

// Discount products
router.get('/discount', productController.getDiscountProducts);

router.delete("/delete/all", productController.deleteAllProducts);
router.delete("/delete/bulk", productController.deleteMultipleProducts); // send { ids: [...] } in body

module.exports = router;
