mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const messageSchema = new mongoose.Schema(
  {
    dataMid: {
      type: Number,
      trim: true,
      sparse: true, // Allow null or undefined values
      unique: true, // This should only be set on one document per dataMid
    },
    dataPeerId: {
      type: Number,
    },
    dataTimestamp: {
      type: Date,
    },
    category: {
      type: String,
      enum: ["desi", "english", "webseries"],
    },
    image: { type: String, unique: true, trim: true, required: true },
    driveFileId: { type: String, trim: true },
    linksArray: {
      type: [String],
      unique: true,
      trim: true,
      required: [true, "links is required"],
    },
    convertedLinksArray: {
      type: [String], // An array of strings
      unique: true, // Ensures uniqueness of strings within the array
      sparse: true, // Allows for documents where this field is not defined
      default: undefined, // Default value for the field (undefined means not defined)
    },
    scrapedFromUserName: { type: String, trim: true }, // on the basis of this you link this to Chat
    scrapedFromUserTitle: { type: String, trim: true },
    scrapedFromChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    isLinkConverted: Boolean,
    isLastInScraping: Boolean, // true means after this msg no scraping
  },
  { timestamps: true }
);

// Pre-save hook If chat not found then create
messageSchema.pre("save", async function (next) {
  let chat = await Chat.findOne({ userName: this.scrapedFromUserName });
  if (!chat) {
    chat = await Chat.create({
      userName: this.scrapedFromUserName,
      userTitle: this.scrapedFromUserTitle,
      dataPeerId: this.dataPeerId,
    });
  }
  this.scrapedFromChat = chat._id;
  next();
});

messageSchema.post("save", async function (doc, next) {
  if (!doc.scrapedFromChat) next(); // error-case
  // 1. 1st method to update chat.
  const updateObj = {
    $addToSet: {
      messages: doc._id,
      dataMidsScraped: doc.dataMid,
    },
    $set: { lastDateOfScraping: doc.createdAt },
  };
  await Chat.findByIdAndUpdate(doc.scrapedFromChat, updateObj);
  // git commit -m "2nd method to update chat is not compatible with scraper hence using 1st method"

  // 2. 2nd method to update chat.
  // const chat = await Chat.findById(doc.scrapedFromChat);
  // if (!chat) next(); // error-case
  // if (!chat?.dataMidsScraped[0] || doc.dataMid < chat.dataMidsScraped[0])
  //   chat.dataMidsScraped[0] = doc.dataMid;
  // else if (!chat?.dataMidsScraped[1] || doc.dataMid > chat.dataMidsScraped[1])
  //   chat.dataMidsScraped[1] = doc.dataMid;
  // chat.lastDateOfScraping = doc.createdAt;
  // chat.messages.push(doc._id);
  // await chat.save();

  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
