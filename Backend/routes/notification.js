const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  deleteNotification,
  markAsRead,
} = require("../controllers/notificationcontrollers");
const { protect, adminOnly } = require("../middleware/authmiddleware");

// Get all notifications (for admins)
router.get("/", protect, adminOnly, getNotifications);

// Create a new notification
router.post("/", protect, adminOnly, createNotification);

// Mark as read
router.put("/:id/read", protect, markAsRead);

// Delete a notification
router.delete("/:id", protect, adminOnly, deleteNotification);

module.exports = router;
