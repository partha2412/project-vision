const multer = require('multer');
const Product = require('../models/Product.js');
const Notification = require("../models/Notification.js");
const { uploadImagesToCloudinary } = require('./imagecontroller.js');
const mongoose = require("mongoose");

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadMiddleware = upload.array('images', 5); // max 5 images

// ===============================
// 📦 Add Product Controller
// ===============================
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

    // Validate required text fields
    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({
        message: 'All text fields are required',
      });
    }

    // Validate image files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'At least one image file is required',
      });
    }

    // Upload images to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(req.files, 'products');

    // Add product in MongoDB
    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      category,
      images: imageUrls,
      stock,
      productType,
      brand,
      gstRate,
      lowStockAlert,
    });

    // ⚠️ Create low-stock notification automatically
    if (product.stock <= (product.lowStockAlert || 5)) {
      await Notification.create({
        type: "warning",
        message: `⚠️ Stock low for '${product.title}' (${product.stock} left)`,
      });
    }

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


// Update Product by ID
exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Copy all text fields from FormData
    const updateData = { ...req.body };

    // If there are new uploaded images, upload to Cloudinary
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadImagesToCloudinary(req.files, 'products');
      updateData.images = imageUrls; // replace or append to existing images
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Validate enum fields if present
    if (updateData.status && !["Active", "Draft", "Out of Stock", "Low Stock"].includes(updateData.status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }
    if (updateData.category && !["Man", "Woman", "Kids"].includes(updateData.category)) {
      return res.status(400).json({ success: false, message: "Invalid category value" });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: error.message,
    });
  }
};


// fetch products by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: error.message,
    });
  }
};



// ===============================
// 🔍 Search Products Controller
// ===============================

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

// ===============================
// 💰 Get Products by Price Range
// ===============================
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

// ===============================
// 🗑 Soft Delete Product
// ===============================
exports.softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isDeleted = true;
    await product.save();

    res.status(200).json({ success: true, message: "Product soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting product", error: error.message });
  }
};

// ===============================
// 🗑 Hard Delete Product
// ===============================
exports.hardDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting product", error: error.message });
  }
};


// Get products sorted by price (ascending or descending)
// Endpoint: GET /api/products/sort?order=asc
exports.getSortedProducts = async (req, res) => {
  try {
    const { order } = req.query;

    // Normalize order query parameter to decide ascending/descending sort
    const o = (order || "asc").toString().toLowerCase().trim();
    const descValues = new Set([
      "desc", "descending", "high", "high-to-low", "high to low", "high_to_low",
      "highto low", "highto_low"
    ]);
    const sortOrder = descValues.has(o) ? -1 : 1; // -1 = descending, 1 = ascending

    // Aggregation pipeline
    const products = await Product.aggregate([
      // Only get products that are not deleted
      { $match: { isDeleted: false } },

      // Extract numeric part from price using regex
      {
        $addFields: {
          _priceMatch: {
            $regexFind: {
              // FIX: Cast price to string to prevent $regexFind error
              input: { $toString: { $ifNull: ["$discountPrice", ""] } },
              regex: /[0-9]+(?:[.,][0-9]+)?/ // match integers or decimals
            }
          }
        }
      },

      // Convert extracted number string to a proper numeric value
      {
        $addFields: {
          priceNum: {
            $let: {
              vars: { m: "$_priceMatch.match" }, // extracted number string
              in: {
                $cond: [
                  // If regex found nothing, default to 0
                  { $or: [{ $eq: ["$$m", null] }, { $eq: ["$$m", ""] }] },
                  0,
                  // Replace comma with dot and convert to double
                  {
                    $toDouble: {
                      $replaceOne: {
                        input: "$$m",
                        find: ",",
                        replacement: "."
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },

      // Sort products numerically by price
      { $sort: { priceNum: sortOrder } },

      // Remove helper fields before sending response
      { $project: { _priceMatch: 0, priceNum: 0 } }
    ]);

    // Return sorted products
    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("Error in getSortedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sorting products",
      error: error.message
    });
  }
};





// ===============================
// Trending Products - newest first
// ===============================
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ===============================
// Best Rating Products
// ===============================
exports.getBestRatingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ rating: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ===============================
// Best Seller Products
// (Based on numOfReviews or you can track soldCount)
// ===============================
exports.getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ numOfReviews: -1 }) // assuming reviews count = popularity
      .limit(20);

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ===============================
// Discount Products
// Products with discountPrice > 0 and < price
// ===============================
exports.getDiscountProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: false,
      $expr: { $lt: ["$discountPrice", "$price"] },
      discountPrice: { $gt: 0 }
    });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.filterProductsByPrice = async (req, res) => {
  try {
    // Convert query params to numbers safely
    let min = parseFloat(req.query.min);
    let max = parseFloat(req.query.max);

    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = Infinity;

    // Fetch products in the range
    const products = await Product.find({
      price: { $gte: min, $lte: max },
    });

    // Return in object format so frontend can do response.data.products
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ message: "Server error while filtering products" });
  }
};




// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Server error while fetching all products" });
  }
};
//other buttons category products
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};




