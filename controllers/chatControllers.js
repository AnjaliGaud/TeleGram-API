const Chat = require("../models/chatModel");
const APIfeatures = require("../utils/APIfeatures");
const catchAsync = require("../utils/catchAsync");

exports.getAllChats = catchAsync(async (req, res, next) => {
  const query = Chat.find({});
  new APIfeatures(query, req.query).filter().sort().fields().page();
  const data = await query;
  res.status(200).json({ status: "success", results: data.length, data });
});

exports.createChat = catchAsync(async (req, res, next) => {
  const newChat = {
    type: req.body.type,
    members: req.body.members,
    subscribers: req.body.subscribers,
    userName: req.body.userName,
    userTittle: req.body.userTittle,
    name: req.body.name,
    privacy: req.body.privacy,
  };
  const createdChat = await Chat.create(newChat);
  res.status(201).json({
    status: "success",
    message: "Chat created successfully",
    createdChat,
  });
});

exports.deleteAllChats = catchAsync(async (req, res, next) => {
  const deletedChats = await Chat.deleteMany();
  if (!deletedChats) {
    return res.status(404).json({ message: "Chats not found" });
  }
  res.status(200).json({ message: "Chats deleted successfully" });
});

exports.getChatById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const chat = await Chat.findById(id);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  res.status(200).json({ chat });
});

exports.updateChatById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  let updatedChat;
  updatedChat = await Chat.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!updatedChat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  res.status(200).json({ message: "Chat updated successfully", updatedChat });
});

exports.deleteChatById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedChat = await Chat.findByIdAndDelete(id);
  if (!deletedChat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  res.status(200).json({ message: "Chat deleted successfully" });
});
