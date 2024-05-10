const Chat = require("../models/chatModel");
const APIfeatures = require("../utils/APIfeatures");

exports.getAllChats = async (req, res, next) => {
  const query = Chat.find({});
  new APIfeatures(query, req.query).filter().sort().fields().page();
  const data = await query;
  res.status(200).json({ status: "success", results: data.length, data });
};

exports.createChat = async (req, res, next) => {
  const newChat = {
    type: req.body.type,
    members: req.body.members,
    subscribers: req.body.subscribers,
    userName: req.body.userName,
    userTittle: req.body.userTittle,
    name: req.body.name,
    privacy: req.body.privacy,
  };
  try {
    const createdChat = await Chat.create(newChat);
    res.status(201).json({
      status: "success",
      message: "Chat created successfully",
      createdChat,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating chat",
      error: err.message,
    });
  }
};

exports.deleteAllChats = async (req, res, next) => {
  try {
    const deletedChats = await Chat.deleteMany();
    if (!deletedChats) {
      return res.status(404).json({ message: "Chats not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error deleting chats" });
  }
  res.status(200).json({ message: "Chats deleted successfully" });
};

exports.getChatById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ chat });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving chat" });
  }
};

exports.updateChatById = async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  let updatedChat;
  try {
    updatedChat = await Chat.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error updating chat" });
  }
  res.status(200).json({ message: "Chat updated successfully", updatedChat });
};

exports.deleteChatById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedChat = await Chat.findByIdAndDelete(id);
    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error deleting chat" });
  }
  res.status(200).json({ message: "Chat deleted successfully" });
};
