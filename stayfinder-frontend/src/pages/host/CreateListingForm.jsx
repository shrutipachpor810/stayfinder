import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  InputLabel,
} from "@mui/material";
import API from "../../api";
import getToken from "../../utils/getToken";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

const CreateListingForm = ({ fetchListings, editing, setEditing }) => {
  const [form, setForm] = useState(
    editing || {
      title: "",
      location: "",
      price: "",
      description: "",
      image: null,
    }
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const formData = new FormData();

    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }
    formData.append("userId", userId);

    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (editing) {
        await API.put(
          `/listings/${editing._id}`,
          formData,
          config
        );
      } else {
        await API.post(
          "/listings",
          formData,
          config
        );
      }

      fetchListings?.();
      setEditing?.(null);

      setForm({
        title: "",
        location: "",
        price: "",
        description: "",
        image: null,
      });

      alert(editing ? "Listing updated!" : "Listing created!");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to submit listing.");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg, #fff0f3, #fff5f7)",
        border: "1px solid #ffe2e7",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: "#e91e63",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {editing ? (
          <>
            <EditNoteIcon /> Update Your Listing
          </>
        ) : (
          <>
            <HomeWorkIcon /> Create a New Stay
          </>
        )}
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3, fontFamily: "'Poppins', sans-serif" }}
      >
        Fill out the form below to list your property.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Property Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#fff", fontFamily: "'Poppins', sans-serif" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#fff", fontFamily: "'Poppins', sans-serif" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Price per Night (₹)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#fff", fontFamily: "'Poppins', sans-serif" }}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Upload Image
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                color: "#e91e63",
                borderColor: "#e91e63",
                backgroundColor: "#fff",
                fontWeight: "500",
                fontFamily: "'Poppins', sans-serif",
                ":hover": {
                  backgroundColor: "#ffe8ef",
                  borderColor: "#c2185b",
                },
              }}
            >
              {form.image?.name || "Choose Image"}
              <input
                type="file"
                name="image"
                hidden
                accept="image/*"
                onChange={handleChange}
                required={!editing}
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Property Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ backgroundColor: "#fff", fontFamily: "'Poppins', sans-serif" }}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#e91e63",
                color: "#fff",
                px: 5,
                py: 1.5,
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: "1rem",
                fontFamily: "'Poppins', sans-serif",
                ":hover": {
                  backgroundColor: "#c2185b",
                },
              }}
            >
              {editing ? "Update Listing" : "Create Listing"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CreateListingForm;
