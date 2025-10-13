const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imagecontroller');

// Route: POST /api/images/upload
router.post(
  '/upload',
  imageController.uploadMiddleware,
  imageController.uploadImages
);

module.exports = router;
