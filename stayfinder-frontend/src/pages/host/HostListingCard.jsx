// src/components/HostListingCard.jsx
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { Delete as DeleteIcon, EditNote as EditNoteIcon } from "@mui/icons-material";

const HostListingCard = ({ listing, onDelete, onEdit }) => {
  const imageUrl = listing.imageUrl.startsWith("/uploads")
    ? `http://localhost:5000${listing.imageUrl}`
    : listing.imageUrl;

  return (
    <Card sx={{ display: "flex", my: 2, p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 200 }}
        image={imageUrl}
        alt={listing.title}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">{listing.title}</Typography>
        <Typography variant="body2">📍 {listing.location}</Typography>
        <Typography variant="body2">₹ {listing.price}/night</Typography>
        <Typography variant="body2" sx={{ my: 1 }}>
          {listing.description}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditNoteIcon />}
            onClick={() => onEdit(listing)}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(listing._id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HostListingCard;
