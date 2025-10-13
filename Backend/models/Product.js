const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Price cannot exceed 8 characters'],
    default: 0.0
  },
  discountPrice: {
    type: Number,
    maxLength: [8, 'Discount price cannot exceed 8 characters'],
    default: 0.0
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Stock cannot exceed 5 characters'],
    default: 0
  },
  status: {
    type: String,
    required: true,
    default: 'Active',
    enum: ['Active', 'Draft', 'Out of Stock', 'Low Stock']
  },
  lowStockAlert: {
    type: Number,
    default: 10
  },
  rating: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  gstRate: {
    type: Number,
    default: 12,
    min: 0,
    max: 28
  },
  category: {
    type: String,
    required: [true, 'Please select category for this product'],
    enum: {
      values: ['Man', 'Woman', 'Kids'],
      message: 'Please select correct category'
    }
  },
  productType: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
