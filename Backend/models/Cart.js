const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
        default: 1
      },
      price: {
        type: Number,
        required: true // store product price at the time of adding to cart
      },
      discountPrice: {
        type: Number,
        default: 0 // store discount price if any
      },
      gstRate: {
        type: Number,
        default: 12 // default GST
      },
      totalPrice: {
        type: Number,
        required: true // calculated as (price - discount + GST) * quantity
      }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0 // sum of totalPrice of all items
  },
  totalItems: {
    type: Number,
    default: 0 // sum of quantities of all items
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
