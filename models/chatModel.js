const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Channel", "Group", "Bot"] },
    members: { type: Number }, // if type is Group
    subscribers: { type: Number }, // if type is Channel
    userName: { type: String, unique: true, trim: true, required: true }, // userName is part of URL of Chat after #
    userTittle: { type: String, trim: true },
    name: { type: String, unique: true, trim: true }, // Name of bot
    privacy: { type: String, enum: ["public", "private"] },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    lastDateOfScraping: { type: Date },
  },
  { timestamps: true }
);
chatSchema.pre("save", function (next) {
  this.privacy = this.userName.includes("-") ? "private" : "public";
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
