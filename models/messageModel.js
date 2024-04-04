const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const messageSchema = new mongoose.Schema(
  {
    dataMid: {
      type: Number,
      unique: true,
      trim: true,
      required: [true, "dataMid is required"],
    },
    dataPeerId: { type: Number, required: [true, "dataPeerId is required"] },
    dataTimestamp: {
      type: Number,
      required: [true, "dataTimestamp is required"],
    },
    image: String,
    links: [
      { type: String, unique: true, required: [true, "links is required"] },
    ],
    scrapedFromUserName: { type: String, trim: true }, // on the basis of this you link this to Chat
    scrapedFromChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    isLinkConverted: Boolean,
    convertedLink: [{ type: String, unique: true, trim: true }],
    // isUploaded: { type: Boolean, default: false },
    uploadedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // if not uploaded then undefined
    isLastInScraping: Boolean, // true means after this msg no scraping
  },
  { timestamps: true }
);

messageSchema.pre("save", async function (next) {
  const chat = await Chat.findOne({ userName: this.scrapedFromUserName });
  if (!chat)
    throw new Error(`Chat not found for userName: ${this.scrapedFromUserName}`);
  this.scrapedFromChat = chat._id;
  next();
});

messageSchema.post("save", async function (doc, next) {
  const updateObj = {
    $addToSet: { messages: this._id },
    $set: { lastDateOfScraping: this.dataTimestamp },
  };
  await Chat.findByIdAndUpdate(this.scrapedFromChat, updateObj);

  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
