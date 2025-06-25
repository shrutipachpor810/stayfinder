import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
} from "@mui/material";
import getToken from "../../utils/getToken";
import InsightsIcon from "@mui/icons-material/Insights";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/listings/host/all", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setListings(res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };

    fetchListings();
  }, []);

  // Generate bar chart data from listings
  const locationData = listings.reduce((acc, listing) => {
    const location = listing.location || "Unknown";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(locationData),
    datasets: [
      {
        label: "Listings by Location",
        data: Object.values(locationData),
        backgroundColor: [
          "#f06292", "#ba68c8", "#4db6ac", "#ffd54f", "#90caf9", "#ff8a65"
        ],
        borderRadius: 6,
        barThickness: 35,
      },
    ],
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(to right, #f9f9fb, #ffeef0)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          background: "#e91e63",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <InsightsIcon sx={{ mr: 1 }} />
        Host Analytics
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderLeft: "6px solid #e91e63",
          backgroundColor: "#fff6f9",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "rgb(6, 6, 6)", mb: 1 }}
        >
          Overview
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Total Listings:{" "}
          <Box component="span" sx={{ color: "#c2185b", fontWeight: "bold" }}>
            {listings.length}
          </Box>
        </Typography>
      </Paper>

      {/* Listings Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {listings.map((listing) => {
          const imageUrl = listing.imageUrl?.startsWith("/uploads")
            ? `http://localhost:5000${listing.imageUrl}`
            : listing.imageUrl;

          return (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card
                elevation={4}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "#fff0f3",
                  boxShadow: "0 6px 15px rgba(252, 182, 159, 0.25)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 10px 25px rgba(252, 182, 159, 0.35)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {imageUrl && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl}
                    alt={listing.title}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/400")
                    }
                  />
                )}
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "rgb(6, 6, 6)" }}
                  >
                    {listing.title}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      color: "#555",
                    }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {listing.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      color: "#444",
                    }}
                  >
                    <CurrencyRupeeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {listing.price} / night
                  </Typography>
                  <Chip
                    label={
                      listing.description.slice(0, 60) +
                      (listing.description.length > 60 ? "..." : "")
                    }
                    sx={{
                      mt: 1,
                      bgcolor: "#ffe5ec",
                      border: "1px solid #f78da7",
                      color: "#c2185b",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Bar Chart */}
      {listings.length > 0 && (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "rgb(6, 6, 6)", mb: 2, textAlign: "center" }}
          >
            Listings Distribution by Location
          </Typography>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                  },
                },
              }}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Analytics;
