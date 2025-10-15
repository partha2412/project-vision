const multer = require('multer');
const Product = require('../models/Product');
const { uploadImagesToCloudinary } = require('./imagecontroller');

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadMiddleware = upload.array('images', 5); // max 5 images

// ✅ Add Product Controller (fixed)
exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      status,
      stock,
      productType,
      brand,
      gstRate,
      lowStockAlert
    } = req.body;

    // ✅ Validate required text fields (not images yet)
    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({
        message: 'All text fields are required',
      });
    }

    // ✅ Validate image files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'At least one image file is required',
      });
    }

    // ✅ Upload images to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(req.files, 'products');

    // ✅ Add product in MongoDB
    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      category,
      images: imageUrls, // Cloudinary URLs
      //status,
      stock,
      productType,
      brand,
      gstRate,
      lowStockAlert,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding product',
      error: error.message,
    });
  }
};


// Update Product by Name
exports.updateProductByName = async (req, res) => {
  try {
    const { productName } = req.params; // name from URL
    const updateData = req.body;

    // Check if product exists by name
    const product = await Product.findOne({ title: productName });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate enum values if provided
    if (updateData.status && !['Active', 'Draft', 'Out of Stock', 'Low Stock'].includes(updateData.status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    if (updateData.category && !['Man', 'Woman', 'Kids'].includes(updateData.category)) {
      return res.status(400).json({ success: false, message: 'Invalid category value' });
    }

    // Ensure images is an array if provided
    if (updateData.images && (!Array.isArray(updateData.images) || updateData.images.length === 0)) {
      return res.status(400).json({ success: false, message: 'Images must be a non-empty array' });
    }

    // Update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { title: productName },
      updateData,
      { new: true, runValidators: true } // return updated doc and validate
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message
    });
  }
};


// fetch products

// Search products by title or description (case-insensitive)
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const products = await Product.find({
      isDeleted: false,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while searching products",
      error: error.message
    });
  }
};


// Fetch products within a price range
exports.getProductsByRange = async (req, res) => {
  try {
    const { min, max } = req.query;

    const minPrice = Number(min) || 0;
    const maxPrice = Number(max) || Infinity;

    const products = await Product.find({
      isDeleted: false,
      price: { $gte: minPrice, $lte: maxPrice }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching products by price range",
      error: error.message
    });
  }
};


// Soft delete a product by ID
exports.softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isDeleted = true; // mark as deleted
    await product.save();

    res.status(200).json({ success: true, message: "Product soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting product", error: error.message });
  }
};

// Hard delete a product by ID
exports.hardDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(id); // remove from DB
    res.status(200).json({ success: true, message: "Product permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting product", error: error.message });
  }
};
