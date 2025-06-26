import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Divider,
  Paper,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EmojiTravelIcon from "@mui/icons-material/EmojiTransportation";
import API from "../api";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get(`/bookings/user/${userId}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookings();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#ffffff",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            You haven't booked any stays yet.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        py: 5,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="700"
          sx={{
            textAlign: "center",
            mb: 4,
            color: "#e91e63",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Your Bookings
        </Typography>

        {bookings.map((booking) => (
          <Card
            key={booking._id}
            sx={{
              mb: 4,
              borderRadius: 4,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              backgroundColor: "#ffffff",
              border: "1px solid #e0e0e0",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.015)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#111", fontFamily: "'Poppins', sans-serif" }}
              >
                {booking.listing?.title || "Untitled Property"}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography
                variant="body2"
                sx={{ color: "#444", fontFamily: "'Poppins', sans-serif" }}
              >
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                <strong>From:</strong>{" "}
                {new Date(booking.startDate).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#444", fontFamily: "'Poppins', sans-serif" }}
              >
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                <strong>To:</strong>{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  color: "#e91e63",
                  fontWeight: "600",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <CurrencyRupeeIcon sx={{ fontSize: 20, mr: 1 }} />
                <strong>Total Price:</strong> ₹{booking.totalPrice}
              </Typography>
            </CardContent>
          </Card>
        ))}

        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: 3,
            border: "1px dashed #ccc",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="500"
            sx={{
              color: "#e91e63",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <EmojiTravelIcon sx={{ fontSize: 20 }} />
            Ready for your next adventure? Start planning your next getaway!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
