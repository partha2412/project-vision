import Cart from '../models/Cart.js';

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !product.title) {
      return res.status(400).json({ message: "Invalid product object" });
    }

    let cart = await Cart.findOne();

    if (!cart) {
      cart = await Cart.create({ items: [{ product, quantity: quantity || 1 }] });
      return res.json(cart);
    }

    // Find existing product by title
    const index = cart.items.findIndex(item => item.product && item.product.title === product.title);

    if (index > -1) {
      cart.items[index].quantity += quantity || 1;
    } else {
      cart.items.push({ product, quantity: quantity || 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      return res.json({ items: [] });
    }

    // Filter out invalid items
    cart.items = cart.items.filter(item => item.product && item.product.title);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity by product title
export const updateCartItem = async (req, res) => {
  try {
    const { productTitle, quantity } = req.body;
    if (!productTitle) return res.status(400).json({ message: "Product title required" });

    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.product && item.product.title === productTitle);

    if (index > -1) {
      cart.items[index].quantity = quantity;
      await cart.save();
      return res.json(cart);
    }

    res.status(404).json({ message: "Product not in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product by title
export const removeCartItem = async (req, res) => {
  try {
    const { productTitle } = req.body;
    if (!productTitle) return res.status(400).json({ message: "Product title required" });

    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product && item.product.title !== productTitle);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
