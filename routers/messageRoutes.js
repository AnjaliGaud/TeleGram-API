const express = require("express");

const messageControllers = require("../controllers/messageControllers");

const router = express.Router();

router
  .route("/msgs-to-convert")
  .get(messageControllers.getMsgsToConvert, messageControllers.getAllMessages);

router
  .route("/")
  .get(messageControllers.getAllMessages)
  .post(messageControllers.createMessage)
  .delete(messageControllers.deleteAllMessages);

router
  .route("/:id")
  .get(messageControllers.getMessageById)
  .patch(messageControllers.updateMessageById)
  .delete(messageControllers.deleteMessageById);

module.exports = router;
