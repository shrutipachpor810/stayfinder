const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: String, 
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
