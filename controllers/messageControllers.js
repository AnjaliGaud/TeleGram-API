const Message = require("../models/messageModel");
const APIfeatures = require("../utils/APIfeatures");
const catchAsync = require("../utils/catchAsync");

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const query = Message.find({});
  new APIfeatures(query, req.query).filter().sort().fields().page();
  const data = await query;
  res.status(200).json({ status: "success", results: data.length, data });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  const newMessage = {
    dataMid: req.body.dataMid,
    dataPeerId: req.body.dataPeerId,
    dataTimestamp: req.body.dataTimestamp,
    image: req.body.image,
    linksArray: req.body.linksArray,
    scrapedFromUserName: req.body.scrapedFromUserName,
    scrapedFromChat: req.body.scrapedFromChat,
    isLinkConverted: req.body.isLinkConverted,
    convertedLinksArray: req.body.convertedLinksArray,
    uploadedTo: req.body.uploadedTo,
    isLastInScraping: req.body.isLastInScraping,
  };
  const createdMessage = await Message.create(newMessage);
  res.status(201).json({
    status: "success",
    message: "Message created successfully",
    createdMessage,
  });
});

exports.deleteAllMessages = catchAsync(async (req, res, next) => {
  const deletedMessages = await Message.deleteMany();
  if (!deletedMessages) {
    return res.status(404).json({ message: "Messages not found" });
  }
  res.status(200).json({ message: "Messages deleted successfully" });
});

exports.getMessageById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }
  res.status(200).json({ message });
});

exports.updateMessageById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  let updatedMessage;
  updatedMessage = await Message.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!updatedMessage) {
    return res.status(404).json({ message: "Message not found" });
  }
  res
    .status(200)
    .json({ message: "Message updated successfully", updatedMessage });
});

exports.deleteMessageById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedMessage = await Message.findByIdAndDelete(id);
  if (!deletedMessage) {
    return res.status(404).json({ message: "Message not found" });
  }
  res.status(200).json({ message: "Message deleted successfully" });
});
