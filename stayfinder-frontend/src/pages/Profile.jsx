import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";

const Profile = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem("userName") || "");
    setUsername(localStorage.getItem("username") || "");
    setEmail(localStorage.getItem("email") || "");
    setPhone(localStorage.getItem("phone") || "");
    setAddress(localStorage.getItem("address") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("address", address);
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 2,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="700"
          gutterBottom
          sx={{ color: "#e91e63", fontFamily: "'Poppins', sans-serif" }}
        >
          Profile Settings
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TextField
          label="Full Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Phone Number"
          type="tel"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneAndroidIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Address"
          fullWidth
          multiline
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HomeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
            backgroundColor: "#e91e63",
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            ":hover": { backgroundColor: "#d81b60" },
          }}
        >
          Save Changes
        </Button>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
