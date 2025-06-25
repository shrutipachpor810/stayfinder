const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// Add or remove favorite
router.post("/", async (req, res) => {
  const { userId, listingId, action } = req.body;

  if (!userId || !listingId || !["add", "remove"].includes(action)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    if (action === "add") {
      await Favorite.updateOne(
        { userId, listingId },
        { $setOnInsert: { userId, listingId } },
        { upsert: true }
      );
      return res.json({ success: true, message: "Added to favorites" });
    } else {
      await Favorite.deleteOne({ userId, listingId });
      return res.json({ success: true, message: "Removed from favorites" });
    }
  } catch (err) {
    console.error("Favorite error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/favorites/:userId
router.get("/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
    .populate("listingId", "title location price imageUrl") // Add any other fields you need
    .lean();

const listings = favorites.map(fav => ({
  _id: fav.listingId._id,
  title: fav.listingId.title,
  location: fav.listingId.location,
  price: fav.listingId.price,
  imageUrl: fav.listingId.imageUrl,
}));

res.json({ favorites: listings });
    const fullListings = favorites
      .map((fav) => fav.listingId)
      .filter((listing) => listing !== null); // in case listing is deleted

    res.json({ favorites: fullListings });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

