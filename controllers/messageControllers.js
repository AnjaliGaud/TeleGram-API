const Message = require("../models/messageModel");
const APIfeatures = require("../utils/APIfeatures");

exports.getAllMessages = async (req, res, next) => {
  const query = Message.find({});
  new APIfeatures(query, req.query).filter().sort().fields().page();
  const data = await query;
  res.status(200).json({ status: "success", results: data.length, data });
};

exports.createMessage = async (req, res, next) => {
  const newMessage = {
    dataMid: req.body.dataMid,
    dataPeerId: req.body.dataPeerId,
    dataTimestamp: req.body.dataTimestamp,
    image: req.body.image,
    links: req.body.links,
    scrapedFromUserName: req.body.scrapedFromUserName,
    scrapedFromChat: req.body.scrapedFromChat,
    isLinkConverted: req.body.isLinkConverted,
    convertedLink: req.body.convertedLink,
    uploadedTo: req.body.uploadedTo,
    isLastInScraping: req.body.isLastInScraping,
  };
  try {
    const createdMessage = await Message.create(newMessage);
    res.status(201).json({
      status: "success",
      message: "Message created successfully",
      createdMessage,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating chat",
      error: err.message,
    });
  }
};

exports.getMessageById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving message" });
  }
};

exports.updateMessageById = async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  let updatedMessage;
  try {
    updatedMessage = await Message.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error updating message" });
  }
  res
    .status(200)
    .json({ message: "Message updated successfully", updatedMessage });
};

exports.deleteMessageById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error deleting message" });
  }
  res.status(200).json({ message: "Message deleted successfully" });
};
