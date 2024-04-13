const express = require("express");

const chatControllers = require("../controllers/chatControllers");

const router = express.Router();

router
  .route("/")
  .get(chatControllers.getAllChats)
  .post(chatControllers.createChat)
  .delete(chatControllers.deleteAllChats);

router
  .route("/:id")
  .get(chatControllers.getChatById)
  .patch(chatControllers.updateChatById)
  .delete(chatControllers.deleteChatById);

module.exports = router;
