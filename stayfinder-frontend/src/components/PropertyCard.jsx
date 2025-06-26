import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box
} from "@mui/material";

// Placeholder images for fallback
const imagePlaceholders = {
  goa: "https://www.holidify.com/images/cmsuploads/compressed/4b494edb-f3a6-46c2-8278-6c87533c90bd_20210430201334.jpeg",
  mumbai: "https://www.homebazaar.com/knowledge/wp-content/uploads/2022/07/Sea-Facing-House.jpg",
};

const PropertyCard = ({ listing }) => {
  const locationKey = listing.location?.toLowerCase();
  const fallbackImage = imagePlaceholders[locationKey] || "https://via.placeholder.com/320";
  const imageSrc = listing.imageUrl?.startsWith("http")
  ? listing.imageUrl 
  : listing.imageUrl
    ? `${process.env.REACT_APP_MEDIA_BASE_URL}${listing.imageUrl}`
    : fallbackImage; 
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: 900,
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
          },
          backgroundColor: "transparent",
        }}
        elevation={0}
      >
        <CardMedia
          component="img"
          sx={{
            width: 320,
            height: "100%",
            objectFit: "cover",
            borderRadius: 2
          }}
          image={imageSrc}
          alt={listing.title}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 4,
            backgroundColor: "white",
            borderRadius: 2,
            flex: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {listing.location}
          </Typography>
          <Typography variant="body1" fontWeight="medium" sx={{ mt: 1 }}>
            ₹{listing.price}/night
          </Typography>
          <Box mt={2}>
            <Button
              component={Link}
              to={`/listing/${listing._id}`}
              variant="outlined"
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                ":hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1565c0"
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PropertyCard;
