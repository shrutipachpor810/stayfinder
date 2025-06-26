// src/components/HostListingCard.jsx
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  EditNote as EditNoteIcon,
} from "@mui/icons-material";


const HostListingCard = ({ listing, onDelete, onEdit }) => {
  const baseUrl = process.env.REACT_APP_MEDIA_BASE_URL || "";
  const imageUrl = listing.imageUrl?.startsWith("/uploads")
    ? `${baseUrl}${listing.imageUrl}`
    : listing.imageUrl || "https://via.placeholder.com/200"; // fallback image

  return (
    <Card sx={{ display: "flex", my: 2, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        sx={{ width: 200, height: 150, borderRadius: 2 }}
        image={imageUrl}
        alt={listing.title}
      />
      <CardContent sx={{ flex: 1, ml: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {listing.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {listing.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ₹ {listing.price}/night
        </Typography>
        <Typography variant="body2" sx={{ my: 1 }}>
          {listing.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditNoteIcon />}
            onClick={() => onEdit(listing)}
            sx={{ textTransform: "none" }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(listing._id)}
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HostListingCard;
