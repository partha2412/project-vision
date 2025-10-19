import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Calculate totalPrice with discount & GST
const calculateTotalPrice = (price, discountPrice, gstRate, quantity) => {
  const effectivePrice = discountPrice || price;
  const gstMultiplier = 1 + (gstRate || 0) / 100;
  return effectivePrice * gstMultiplier * quantity;
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    const itemData = {
      product: productId,
      quantity,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      gstRate: product.gstRate || 0,
      totalPrice: calculateTotalPrice(product.price, product.discountPrice, product.gstRate, quantity),
      image: product.images[0] || "",
    };

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [itemData] });
    } else {
      const index = cart.items.findIndex((item) => item.product.toString() === productId);
      if (index > -1) {
        const item = cart.items[index];
        item.quantity += quantity;
        item.totalPrice = calculateTotalPrice(item.price, item.discountPrice, item.gstRate, item.quantity);
      } else {
        cart.items.push(itemData);
      }
    }

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    cart = await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update quantity by product ID
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex((item) => item.product.toString() === productId);
    if (index === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.items[index].quantity = quantity;
    cart.items[index].totalPrice = calculateTotalPrice(
      cart.items[index].price,
      cart.items[index].discountPrice,
      cart.items[index].gstRate,
      quantity
    );

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialCount = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    if (cart.items.length === initialCount) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    const updatedCart = await cart.populate("items.product");

    res.status(200).json({
      message: "Item removed successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    //console.log(userId);
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Increment / Decrement quantity
export const changeCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, increment } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex((item) => item.product.toString() === productId);
    if (index === -1) return res.status(404).json({ message: "Product not in cart" });

    if (increment) cart.items[index].quantity += 1;
    else cart.items[index].quantity = Math.max(1, cart.items[index].quantity - 1);

    cart.items[index].totalPrice = calculateTotalPrice(
      cart.items[index].price,
      cart.items[index].discountPrice,
      cart.items[index].gstRate,
      cart.items[index].quantity
    );

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
