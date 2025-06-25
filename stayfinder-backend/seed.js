const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Listing = require("./models/Listing");

dotenv.config();

const seedListings = [
  {
    title: "Beachside Cottage in Goa",
    location: "Goa",
    price: 3200,
    description: "A cozy beachside stay with WiFi and AC.",
    imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-24546848/original/2a06d56a-e907-40d0-bd01-4105f9b89b32.jpeg",
  },
  {
    title: "Luxury Flat in Mumbai",
    location: "Mumbai",
    price: 5400,
    description: "2BHK with a sea view and balcony.",
    imageUrl: "https://i.pinimg.com/originals/14/b6/eb/14b6eb0c033c4b5ad7ac34429e1f7c3b.jpg"
  },
  {
    title: "Mountain View Cottage in Manali",
    location: "Manali",
    price: 2500,
    description: "Enjoy peaceful mornings with breathtaking views of the Himalayas.",
    imageUrl: "https://res.cloudinary.com/simplotel/image/upload/x_64,y_412,w_843,h_475,r_0,c_crop,q_80,fl_progressive/w_910,f_auto,c_fit/clarks-inn-suites-manali/_LAL1851_edit_f27cgo.jpg", 
  },
  {
    title: "Heritage Villa by the Lake",
    location: "Udaipur",
    price: 4000,
    description: "Traditional Rajasthani villa with modern comfort by the lakefront.",
    imageUrl: "https://www.thelalit.com/wp-content/uploads/2022/03/The-LALIT-Udaipur_01.jpg", 
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Listing.insertMany(seedListings);
    console.log("Listings seeded!");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

seed();
