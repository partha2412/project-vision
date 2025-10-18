const Wishlist = require("../models/Wishlist");

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    res.json({ products: wishlist ? wishlist.products : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  const { product } = req.body;
  if (!product || !product._id || !product.name || !product.price || !product.image) {
    return res.status(400).json({ message: "Complete product data is required" });
  }

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [product] });
    } else {
      if (!wishlist.products.some((p) => p._id === product._id)) {
        wishlist.products.push(product);
      }
    }

    await wishlist.save();
    res.json({ products: wishlist.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p._id !== productId);
      await wishlist.save();
      res.json({ products: wishlist.products });
    } else {
      res.json({ products: [] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
