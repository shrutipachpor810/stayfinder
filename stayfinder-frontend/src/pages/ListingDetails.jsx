import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import {
  Card,
  CardMedia,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Avatar,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  LocationOn,
  Share,
  Favorite,
  FavoriteBorder,
  Star,
  Wifi,
  LocalParking,
  Kitchen,
  Pool,
  Pets,
  SmokeFree,
} from "@mui/icons-material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const imagePlaceholders = {
  goa: "https://www.holidify.com/images/cmsuploads/compressed/4b494edb-f3a6-46c2-8278-6c87533c90bd_20210430201334.jpeg",
  mumbai: "https://www.homebazaar.com/knowledge/wp-content/uploads/2022/07/Sea-Facing-House.jpg",
};

const amenities = [
  { icon: <Wifi />, label: "Free WiFi" },
  { icon: <LocalParking />, label: "Free Parking" },
  { icon: <Kitchen />, label: "Kitchen" },
  { icon: <Pool />, label: "Pool" },
  { icon: <Pets />, label: "Pet Friendly" },
  { icon: <SmokeFree />, label: "Non-smoking" },
];

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const userId = localStorage.getItem("userId");

  // Fetch listing and check if favorited
  useEffect(() => {
    setLoading(true);
    
    // Fetch listing
    API.get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        geocodeLocation(res.data.location);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listing:", err);
        setLoading(false);
      });

    //if listing is in favorites
    if (userId) {
      const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
      setFavorites(savedFavorites);
      setIsFavorited(savedFavorites.includes(id));
    }
  }, [id, userId]);

  const geocodeLocation = async (location) => {
    try {
      const res = await API.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const [lng, lat] = res.data.features[0].center;
      setCoordinates({ lat, lng });
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const calculateNights = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleCalculatePrice = () => {
    setErrorMsg("");

    if (!userId) {
      alert("Please log in first.");
      return navigate("/login");
    }

    if (!startDate || !endDate) {
      setErrorMsg("Please select both start and end dates.");
      return;
    }

    const nights = calculateNights(startDate, endDate);
    if (nights <= 0) {
      setErrorMsg("End date must be after start date.");
      return;
    }

    setTotalPrice(nights * listing.price);
  };

  const handleBooking = async () => {
    try {
      await API.post(`/bookings`, {
        userId,
        listingId: id,
        startDate,
        endDate,
        totalPrice,
      });

      setSnackbarOpen(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Booking failed. Please try again.");
    }
  };

  const toggleFavorite = () => {
    if (!userId) {
      alert("Please log in to add favorites.");
      return;
    }

    const updatedFavorites = isFavorited 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(updatedFavorites);
    setIsFavorited(!isFavorited);
    
    // Save to localStorage
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    
    try {
      API.post(`/favorites`, {
        userId,
        listingId: id,
        action: isFavorited ? 'remove' : 'add'
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4, p: 3 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="text" height={100} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!listing) return <Typography>Listing not found</Typography>;

  const fallbackImage = imagePlaceholders[listing?.location?.toLowerCase()] || "https://via.placeholder.com/800";
  const imageSrc = listing.imageUrl?.startsWith("http")
  ? listing.imageUrl
  : listing.imageUrl
    ? `${process.env.REACT_APP_MEDIA_BASE_URL}${listing.imageUrl}`
    : fallbackImage;
  const nights = startDate && endDate ? calculateNights(startDate, endDate) : 0;
  
  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 2, p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h4" fontWeight="600" sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
            {listing.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={toggleFavorite} sx={{ color: isFavorited ? "#FF385C" : "inherit" }}>
              {isFavorited ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton>
              <Share />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star sx={{ color: "#FF385C", fontSize: "1rem" }} />
            <Typography variant="body2" fontWeight="600">4.8</Typography>
            <Typography variant="body2" color="text.secondary">(124 reviews)</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">•</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOn sx={{ color: "text.secondary", fontSize: "1rem" }} />
            <Typography variant="body2" color="text.secondary">{listing.location}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Image */}
      <Card sx={{ mb: 4, borderRadius: 3, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}>
        <CardMedia
        component="img"
        height="400"
        image={imageSrc}
        alt={listing.title}
        sx={{ objectFit: "cover" }}
      />
      </Card>

      <Grid container spacing={4}>
        {/* Left Column - Property Details */}
        <Grid item xs={12} md={8}>
          {/* Host Information */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, pb: 3, borderBottom: "1px solid #EBEBEB" }}>
            <Avatar 
              src={listing.hostAvatar || "/api/placeholder/40/40"} 
              sx={{ width: 56, height: 56 }}
            >
              {listing.hostName ? listing.hostName.charAt(0).toUpperCase() : 'H'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {listing.hostName ? `Hosted by ${listing.hostName}` : 'Hosted by StayFinder'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {listing.hostName ? 'Superhost • 3 years hosting' : 'Verified by StayFinder'}
              </Typography>
            </Box>
          </Box>

          {/* Property Features */}
          <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid #EBEBEB" }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>About this place</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2 }}>
              {listing.description}
            </Typography>
            <Button variant="text" sx={{ color: "#FF385C", textTransform: "none", p: 0 }}>
              Show more
            </Button>
          </Box>

          {/* Amenities */}
          <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid #EBEBEB" }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>What this place offers</Typography>
            <Grid container spacing={2}>
              {amenities.slice(0, 6).map((amenity, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                    {React.cloneElement(amenity.icon, { sx: { color: "text.secondary" } })}
                    <Typography variant="body2">{amenity.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Map */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>Where you'll be</Typography>
            {coordinates && (
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Map
                  mapboxAccessToken={MAPBOX_TOKEN}
                  initialViewState={{
                    longitude: coordinates.lng,
                    latitude: coordinates.lat,
                    zoom: 12,
                  }}
                  style={{ width: "100%", height: 300 }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  attributionControl={false}
                >
                  <Marker
                    longitude={coordinates.lng}
                    latitude={coordinates.lat}
                    anchor="bottom"
                  >
                    <Box
                      sx={{
                        backgroundColor: "#FF385C",
                        color: "white",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        border: "3px solid white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      ★
                    </Box>
                  </Marker>
                </Map>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Right Column - Booking Card */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              position: "sticky",
              top: 24,
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
                <Typography variant="h5" fontWeight="600">₹{listing.price.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">per night</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Star sx={{ color: "#FF385C", fontSize: "1rem" }} />
                <Typography variant="body2" fontWeight="600">4.8</Typography>
                <Typography variant="body2" color="text.secondary">• 124 reviews</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={0} sx={{ border: "1px solid #DDDDDD", borderRadius: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Check-in"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                        borderRadius: "8px 0 0 8px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Check-out"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                        borderRadius: "0 8px 8px 0",
                        borderLeft: "1px solid #DDDDDD",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCalculatePrice}
              sx={{
                backgroundColor: "#FF385C",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                py: 1.5,
                mb: 2,
                "&:hover": {
                  backgroundColor: "#E31C5F",
                },
              }}
            >
              Check Availability
            </Button>

            {totalPrice && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">₹{listing.price.toLocaleString()} × {nights} nights</Typography>
                  <Typography variant="body2">₹{(listing.price * nights).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Service fee</Typography>
                  <Typography variant="body2">₹{Math.round(totalPrice * 0.05).toLocaleString()}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">Total</Typography>
                  <Typography variant="h6" fontWeight="600">₹{(totalPrice + Math.round(totalPrice * 0.05)).toLocaleString()}</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleBooking}
                  sx={{
                    backgroundColor: "#FF385C",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    py: 1.5,
                    mb: 2,
                    "&:hover": {
                      backgroundColor: "#E31C5F",
                    },
                  }}
                >
                  Reserve
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                  You won't be charged yet
                </Typography>

                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: (totalPrice + Math.round(totalPrice * 0.05)).toString(),
                            currency_code: "INR",
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(() => {
                      setSnackbarOpen(true);
                      setTimeout(() => navigate("/dashboard"), 2000);
                    });
                  }}
                  onError={() => {
                    setErrorMsg("Payment failed. Please try again.");
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Booking successful! Redirecting to Dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListingDetails;