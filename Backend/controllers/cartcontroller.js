import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Helper function to calculate totalPrice including GST
const calculateTotalPrice = (price, discountPrice, gstRate, quantity) => {
  const effectivePrice = discountPrice || price;
  const gstMultiplier = 1 + (gstRate || 0) / 100;
  return effectivePrice * gstMultiplier * quantity;
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

   const itemData = {
  product: productId,
  quantity: quantity || 1,
  price: product.price,
  discountPrice: product.discountPrice || 0,
  gstRate: product.gstRate || 0,
  totalPrice: calculateTotalPrice(product.price, product.discountPrice, product.gstRate, quantity || 1),
  image: product.images[0] || "", // ✅ Add product image
};


    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [itemData],
      });
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
      if (index > -1) {
        const item = cart.items[index];
        item.quantity += quantity || 1;
        item.totalPrice = calculateTotalPrice(item.price, item.discountPrice, item.gstRate, item.quantity);
      } else {
        cart.items.push(itemData);
      }
    }

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    cart = await cart.populate("items.product"); // populate product details
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
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
      const item = cart.items[index];
      item.quantity = quantity;
      item.totalPrice = calculateTotalPrice(item.price, item.discountPrice, item.gstRate, item.quantity);

      cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

      await cart.save();
      return res.json(await cart.populate("items.product"));
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
    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.json(await cart.populate("items.product"));
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
    cart.totalItems = 0;
    cart.totalAmount = 0;

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
    const { productId, increment } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index === -1) return res.status(404).json({ message: "Product not in cart" });

    const item = cart.items[index];
    if (increment) item.quantity += 1;
    else item.quantity = Math.max(1, item.quantity - 1);

    item.totalPrice = calculateTotalPrice(item.price, item.discountPrice, item.gstRate, item.quantity);

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
