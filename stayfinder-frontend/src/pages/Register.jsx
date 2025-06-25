import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Registration failed. Try again."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #ffe5ec, #fcd5ce)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          background: "#fff",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="700"
          gutterBottom
          sx={{
            textAlign: "center",
            background: "linear-gradient(45deg, #e91e63, #f06292)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Your Account 
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            variant="outlined"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            variant="outlined"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="host">Host</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              background: "linear-gradient(45deg, #f06292, #e91e63)",
              boxShadow: "0 4px 20px rgba(233, 30, 99, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #ec407a, #d81b60)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Sign Up
          </Button>
        </form>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "#444" }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#e91e63",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
