const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  deleteNotification,
  markAsRead,
} = require("../controllers/notificationcontrollers.js");
const { protect, adminOnly } = require("../middleware/authmiddleware.js");

// Get all notifications (for admins)
router.get("/", getNotifications);

// Create a new notification
router.post("/create", protect, adminOnly, createNotification);

// Mark as read
router.put("/read/:id", protect, markAsRead);

// Delete a notification
router.delete("/delete/:id", protect, adminOnly, deleteNotification);

module.exports = router;
