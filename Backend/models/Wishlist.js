const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate products per user
wishlistSchema.pre("save", function (next) {
  if (this.products && this.products.length > 0) {
    this.products = this.products.filter(
      (v, i, a) =>
        a.findIndex((t) => t.product.toString() === v.product.toString()) === i
    );
  }
  next();
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
