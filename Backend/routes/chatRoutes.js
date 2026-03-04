const express = require("express");
const { sendChatMessage } = require("../controllers/chatController.js");
const { testChat, productsEmbeding } = require("../controllers/testChatController.js");
const router = express.Router();

router.post("/send",sendChatMessage);
router.post("/test",testChat);
router.post("/embed_all_Products", productsEmbeding)

module.exports = router;