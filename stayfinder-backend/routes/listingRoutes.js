const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/auth"); 
const listingController = require("../controllers/listingController");

// Public Routes
router.get("/", listingController.getListings);
router.get("/host/all", authMiddleware, listingController.getHostListings);
router.get("/:id", listingController.getListingById);

// Protected (Host-only)
router.post("/", authMiddleware, upload.single("image"), listingController.createListing);
router.put("/:id", authMiddleware, upload.single("image"), listingController.updateListing);
router.delete("/:id", authMiddleware, listingController.deleteListing);

module.exports = router;
