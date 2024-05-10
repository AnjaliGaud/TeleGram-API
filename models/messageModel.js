const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const messageSchema = new mongoose.Schema(
  {
    dataMid: {
      type: Number,
      trim: true,
      sparse: true, // Allow null or undefined values
      unique: true, // This should only be set on one document per dataMid
    },
    category: {
      type: String,
      enum: ["desi", "english", "webseries"],
    },
    image: { type: String, unique: true, trim: true, required: true },
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
    scrapedFromUserTittle: { type: String, trim: true },
    scrapedFromChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    isLinkConverted: Boolean,
    isLastInScraping: Boolean, // true means after this msg no scraping
  },
  { timestamps: true }
);

messageSchema.pre("save", async function (next) {
  if (!this.scrapedFromUserName) next();

  const chat = await Chat.findOne({ userName: this.scrapedFromUserName });
  if (chat) this.scrapedFromChat = chat?._id;
  next();
});

messageSchema.post("save", async function (doc, next) {
  if (!doc.scrapedFromChat) next();
  const updateObj = {
    $addToSet: { messages: doc._id },
    $set: { lastDateOfScraping: doc.createdAt },
  };
  await Chat.findByIdAndUpdate(doc.scrapedFromChat, updateObj);

  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
