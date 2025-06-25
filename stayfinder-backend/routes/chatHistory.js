router.post("/history", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  try {
    const history = await ChatHistory.findOneAndUpdate(
      { userId },
      { $push: { messages: message } },
      { upsert: true, new: true }
    );
    res.json({ success: true, history });
  } catch (err) {
    console.error("History save error:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});
