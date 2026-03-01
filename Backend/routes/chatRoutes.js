const express = require("express");
const { sendChatMessage } = require("../controllers/chatController.js");
const router = express.Router();

router.post("/send",sendChatMessage);

module.exports = router;