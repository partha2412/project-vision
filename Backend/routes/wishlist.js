const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistcontrollers");
const { isAuthenticated } = require('../middleware/auth');

router.get("/", isAuthenticated, getWishlist);
router.post("/add", isAuthenticated, addToWishlist);
router.post("/remove", isAuthenticated, removeFromWishlist);

module.exports = router;
