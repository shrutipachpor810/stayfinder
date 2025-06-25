import React, { useEffect, useState } from "react";
import axios from "axios";
import HostListingCard from "../host/HostListingCard";
import getToken from "../../utils/getToken";

const MyListings = () => {
  const [listings, setListings] = useState([]);

  const fetchHostListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/listings/host/all", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching host listings:", err);
    }
  };

  useEffect(() => {
    fetchHostListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchHostListings(); // refresh after delete
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Listings</h2>
      {listings.map((listing) => (
        <HostListingCard
          key={listing._id}
          listing={listing}
          onDelete={handleDelete}
          onEdit={() => {}}
        />
      ))}
    </div>
  );
};

export default MyListings;
