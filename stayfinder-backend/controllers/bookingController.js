const Booking = require("../models/Booking");

// Create a new booking
exports.createBooking = async (req, res) => {
  const { listingId, userId, startDate, endDate, totalPrice } = req.body;

  console.log("Booking data received:", { listingId, userId, startDate, endDate, totalPrice });

  try {
    const booking = new Booking({
      listing: listingId,
      user: userId,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save(); 
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking save failed:", err.message); 
    res.status(500).json({ error: err.message || "Server error" });
  }
};


// Get all bookings by user ID
exports.getBookingsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ user: userId }).populate("listing");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
