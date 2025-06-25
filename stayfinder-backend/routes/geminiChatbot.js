const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/ChatHistory");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: "Message and userId are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const reply = result.response.text();

    // Save to chat history
    await ChatHistory.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          messages: [
            { sender: "user", text: message },
            { sender: "bot", text: reply },
          ],
        },
      },
      { upsert: true, new: true }
    );

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;
