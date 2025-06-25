const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunityPost");

// Create a new post
router.post("/", async (req, res) => {
  const { userId, name, content } = req.body; 

  if (!userId || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const post = new CommunityPost({ userId, name, content }); 
    await post.save();
    res.json({ message: "Post created", post });
    console.log("Saved post:", post);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
