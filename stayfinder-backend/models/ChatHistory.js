const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [
    {
      sender: String, 
      text: String,
      timestamp: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
