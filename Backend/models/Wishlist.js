const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 products: [
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },

    image: { type: String, required: true },
    description: { type: String }
  }
]

});

module.exports = mongoose.model("Wishlist", wishlistSchema);
