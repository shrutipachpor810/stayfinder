import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      if (user.role === "host") {
        navigate("/host/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password.");
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
          Welcome Back
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
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
            Login
          </Button>
        </form>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "#444" }}
        >
          Don’t have an account?{" "}
          <span
            style={{
              color: "#e91e63",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
