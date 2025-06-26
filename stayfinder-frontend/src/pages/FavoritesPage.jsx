import React, { useEffect, useState } from "react";
import API from "../api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Container,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useNavigate } from "react-router-dom";

const fallbackImage = "https://via.placeholder.com/400";

const FavoritesPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    API
      .get(`${process.env.REACT_APP_API_BASE_URL}/favorites/${userId}`)
      .then((res) => {
        setFavorites(res.data.favorites || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setLoading(false);
      });
  }, [userId]);

  if (!userId) {
    return (
      <Box p={4} minHeight="100vh" bgcolor="#fff">
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            color: "#111",
          }}
        >
          Please log in to view your favorites.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={4} minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#fff">
        <CircularProgress />
      </Box>
    );
  }

  if (favorites.length === 0) {
    return (
      <Box p={4} minHeight="100vh" bgcolor="#fff">
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            color: "#111",
          }}
        >
          No favorites found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" mb={4}>
          <FavoriteIcon sx={{ color: "#e91e63", mr: 1 }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "700",
              color: "#e91e63",
            }}
          >
            Your Favorite Listings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {favorites.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card
                onClick={() => navigate(`/listing/${listing._id}`)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    listing.imageUrl?.startsWith("http")
                      ? listing.imageUrl
                      : listing.imageUrl
                      ? `${process.env.REACT_APP_MEDIA_BASE_URL}${listing.imageUrl}`
                      : fallbackImage
                  }
                  alt={listing.title}
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.src = fallbackImage;
                  }}
                />

                <CardContent sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#111", mb: 1 }}
                  >
                    {listing.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", color: "#666" }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {listing.location}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      color: "#e91e63",
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CurrencyRupeeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {listing.price} per night
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FavoritesPage;
