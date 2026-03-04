const express = require("express");
const { sendChatMessage } = require("../controllers/chatController.js");
const { testChat, productsEmbeding } = require("../controllers/testChatController.js");
const router = express.Router();

router.post("/send",sendChatMessage);
router.post("/test",testChat);

module.exports = router;