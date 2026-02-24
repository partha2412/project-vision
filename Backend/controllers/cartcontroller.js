import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Calculate totalPrice with discount & GST
const calculateTotalPrice = (price, discountPrice, gstRate, quantity) => {
  const effectivePrice = discountPrice || price;
  const gstMultiplier = 1 + (gstRate || 0) / 100;
  return effectivePrice * gstMultiplier * quantity;
};
const removeInvalidCartItems = (cart) => {
  cart.items = cart.items.filter(item => item.product);
  cart.totalItems = cart.items.reduce((a, i) => a + i.quantity, 0);
  cart.totalAmount = cart.items.reduce((a, i) => a + i.totalPrice, 0);
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;    
    const { productId, quantity = 1 } = req.body;

    // ✅ Validate productId
    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    // ✅ Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // ✅ Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    const itemData = {
      product: productId, // ✅ store ObjectId, NOT full object
      quantity,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      gstRate: product.gstRate || 0,
      totalPrice: calculateTotalPrice(
        product.price,
        product.discountPrice,
        product.gstRate,
        quantity
      ),
      image: product.images?.[0] || "",
    };

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [itemData],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
        cart.items[index].totalPrice = calculateTotalPrice(
          cart.items[index].price,
          cart.items[index].discountPrice,
          cart.items[index].gstRate,
          cart.items[index].quantity
        );
      } else {
        cart.items.push(itemData);
      }
    }

    // ✅ Recalculate totals
    cart.totalItems = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    await cart.save();

    cart = await cart.populate("items.product");

    // ✅ Remove invalid products if any
    removeInvalidCartItems(cart);
    await cart.save();

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
    removeInvalidCartItems(cart);
    await cart.save();
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

    // ✅ Validate productId
    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    // ✅ Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const index = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    // ✅ Update quantity & price
    cart.items[index].quantity = quantity;
    cart.items[index].totalPrice = calculateTotalPrice(
      cart.items[index].price,
      cart.items[index].discountPrice,
      cart.items[index].gstRate,
      quantity
    );

    // ✅ Recalculate totals
    cart.totalItems = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    await cart.save();

    cart = await cart.populate("items.product");

    // ✅ Remove invalid products if any
    removeInvalidCartItems(cart);
    await cart.save();

    res.json(cart);

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
    cart = await cart.populate("items.product");

    removeInvalidCartItems(cart);
    await cart.save();

    res.status(200).json({
      message: "Item removed successfully",
      cart,
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
    cart = await cart.populate("items.product");

    removeInvalidCartItems(cart);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
