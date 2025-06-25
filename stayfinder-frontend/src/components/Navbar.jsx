import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole"); // "user" or "host"

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    handleMenuClose();
    navigate("/login");
  };

  const getInitials = () => {
    if (!userName) return "U";
    const names = userName.trim().split(" ");
    return (names[0][0] + (names[1]?.[0] || "")).toUpperCase();
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ backgroundColor: "#fff", color: "#333" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LOGO */}
        <Box display="flex" alignItems="center">
          <HomeIcon sx={{ mr: 1, color: "#e91e63" }} />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              color: "#e91e63",
              textDecoration: "none",
              fontFamily: "cursive",
            }}
          >
            StayFinder
          </Typography>
        </Box>

        {/* Role-Based Links */}
        <Box display={{ xs: "none", md: "flex" }} gap={3}>
          {/* USER Role */}
          {userRole === "user" && (
            <>
              <Button component={Link} to="/" color="inherit" sx={{ fontWeight: "bold" }}>Explore</Button>
              <Button component={Link} to="/dashboard" color="inherit" sx={{ fontWeight: "bold" }}>Dashboard</Button>
              <Button component={Link} to="/community" color="inherit" sx={{ fontWeight: "bold" }}>Community</Button>
              

            </>
          )}

          {/* HOST Role */}
          {userRole === "host" && (
            <>
              <Button component={Link} to="/" color="inherit" sx={{ fontWeight: "bold" }}>Home</Button>
              <Button component={Link} to="/host/create" color="inherit" sx={{ fontWeight: "bold" }}>Add Listing</Button>
              <Button component={Link} to="/host/dashboard" color="inherit" sx={{ fontWeight: "bold" }}>My Listings</Button>
              <Button component={Link} to="/host/analytics" color="inherit" sx={{ fontWeight: "bold" }}>Analytics</Button>
              <Button component={Link} to="/community" color="inherit" sx={{ fontWeight: "bold" }}>Community</Button>

            </>
          )}
        </Box>

        {/* Avatar Section / Login */}
        <Box display="flex" alignItems="center" gap={2}>
          {userId ? (
            <>
              <Tooltip title="Account Settings">
                <IconButton onClick={handleAvatarClick}>
                  <Avatar sx={{ bgcolor: "#e91e63" }}>{getInitials()}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                  Profile
                </MenuItem>
                {userRole === "user" && (
                  <MenuItem onClick={() => { navigate("/favorites"); handleMenuClose(); }}>
                    Favorites
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: "#e91e63",
                  borderColor: "#e91e63",
                  borderRadius: "999px",
                  fontWeight: 500,
                  ":hover": { backgroundColor: "#ffe4ec" },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: "#e91e63",
                  borderRadius: "999px",
                  fontWeight: 500,
                  ":hover": { backgroundColor: "#d81b60" },
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
