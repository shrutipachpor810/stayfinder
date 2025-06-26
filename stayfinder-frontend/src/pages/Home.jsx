import { useEffect, useState } from "react";
import api from "../api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar"; 
import { Box, Typography, Container } from "@mui/material";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await api.get("/listings");
      setListings(res.data);
      setFilteredListings(res.data); 
    };
    fetchListings();
  }, []);

  const handleFilter = (filters) => {
    const { location, minPrice, maxPrice } = filters;

    const results = listings.filter((listing) => {
      const matchLocation = location
        ? listing.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchPrice =
        (!minPrice || listing.price >= parseInt(minPrice)) &&
        (!maxPrice || listing.price <= parseInt(maxPrice));

      return matchLocation && matchPrice;
    });

    setFilteredListings(results);
  };

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg" sx={{ fontFamily: "'Poppins', sans-serif" }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            color: "#e91e63",
            mb: 4,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
        Explore Properties 
      </Typography>

     {/* searchbar */}
      <SearchBar onFilter={handleFilter} />

      {/* Listings */}
      <Box
        mt={4}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <PropertyCard key={listing._id} listing={listing} />
          ))
        ) : (
          <Typography mt={2}>No properties match your filters.</Typography>
        )}
      </Box>
      </Container>
    </Box>
  );
};

export default Home;
