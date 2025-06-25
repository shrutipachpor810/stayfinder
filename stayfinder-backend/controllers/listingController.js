const Listing = require("../models/Listing");

// GET all listings (for users)
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST create new listing (host only)
exports.createListing = async (req, res) => {
  try {
    const { title, location, description, price } = req.body;

    if (!title || !location || !description || !price || !req.file) {
      return res.status(400).json({ error: "All fields including image are required." });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const newListing = new Listing({
      title,
      location,
      description,
      price,
      imageUrl: imagePath,
      host: req.user.id, // from auth middleware
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ error: "Server error while creating listing" });
  }
};

// GET all listings by the host
exports.getHostListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching host's listings" });
  }
};

// PUT: update listing (host only)
exports.updateListing = async (req, res) => {
  try {
    const { title, location, description, price } = req.body;

    const updatedFields = {
      title,
      location,
      description,
      price,
    };

    if (req.file) {
      updatedFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedListing = await Listing.findOneAndUpdate(
      { _id: req.params.id, host: req.user.id }, 
      updatedFields,
      { new: true }
    );

    if (!updatedListing)
      return res.status(404).json({ error: "Listing not found or unauthorized" });

    res.json(updatedListing);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

// DELETE listing (host only)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      host: req.user.id,
    });

    if (!listing)
      return res.status(404).json({ error: "Listing not found or unauthorized" });

    res.json({ msg: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};
