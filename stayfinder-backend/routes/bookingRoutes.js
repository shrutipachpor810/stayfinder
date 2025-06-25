const express = require("express");
const router = express.Router();
const { createBooking, getBookingsByUser } = require("../controllers/bookingController");

// Create a booking
router.post("/", createBooking);

// Get bookings by user
router.get("/user/:userId", getBookingsByUser);

module.exports = router;
