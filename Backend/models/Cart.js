import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: Object }, // product object must exist
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  items: { type: [cartItemSchema], default: [] } // default empty array
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
