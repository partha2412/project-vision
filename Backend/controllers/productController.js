const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, category, images, status, stock } = req.body;

    // Validate required fields
    if (!title || !description || !price || !images || !Array.isArray(images) || images.length === 0 || !stock || !status || !category) {
      return res.status(400).json({ message: 'All fields are required and images must be a non-empty array' });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      images,
      status,
      stock
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while adding product',
      error: error.message
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
