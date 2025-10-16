import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{
          product: productId,
          quantity: quantity || 1,
          price: product.price,
          discountPrice: product.discountPrice || 0,
          gstRate: product.gstRate,
          totalPrice: ((product.discountPrice || product.price) * (1 + product.gstRate / 100)) * (quantity || 1)
        }]
      });
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);

      if (index > -1) {
        cart.items[index].quantity += quantity || 1;
        const item = cart.items[index];
        item.totalPrice = ((item.discountPrice || item.price) * (1 + item.gstRate / 100)) * item.quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
          price: product.price,
          discountPrice: product.discountPrice || 0,
          gstRate: product.gstRate,
          totalPrice: ((product.discountPrice || product.price) * (1 + product.gstRate / 100)) * (quantity || 1)
        });
      }
    }

    // Update cart totals
    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();

    cart = await cart.populate('items.product'); // populate product details
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.json({ items: [], totalAmount: 0, totalItems: 0 });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity by product ID
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index > -1) {
      cart.items[index].quantity = quantity;
      const item = cart.items[index];
      item.totalPrice = ((item.discountPrice || item.price) * (1 + item.gstRate / 100)) * item.quantity;

      // Update cart totals
      cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

      await cart.save();
      return res.json(await cart.populate('items.product'));
    }

    res.status(404).json({ message: "Product not in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Update cart totals
    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.json(await cart.populate('items.product'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalAmount = 0;
    cart.totalItems = 0;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment / Decrement item quantity
export const changeCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, increment } = req.body; // increment: true/false

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index === -1) return res.status(404).json({ message: "Product not in cart" });

    if (increment) cart.items[index].quantity += 1;
    else cart.items[index].quantity = Math.max(1, cart.items[index].quantity - 1);

    const item = cart.items[index];
    item.totalPrice = ((item.discountPrice || item.price) * (1 + item.gstRate / 100)) * item.quantity;

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.json(await cart.populate('items.product'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
