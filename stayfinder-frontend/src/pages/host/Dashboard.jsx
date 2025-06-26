import { useEffect, useState } from "react";
import API from "../../api"; 
import HostListingCard from "./HostListingCard";
import CreateListingForm from "./CreateListingForm";
import getToken from "../../utils/getToken";
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
  Grid,
  Chip,
  Divider,
  Modal,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  EditNote as EditNoteIcon,
} from "@mui/icons-material";

const HostDashboard = () => {
  const [listings, setListings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/listings/host/all", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setListings(res.data);
    } catch (err) {
      setError("Failed to load your listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await API.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchListings();
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  const handleEdit = (listing) => {
    setEditing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const EmptyState = () => (
    <Card sx={{ textAlign: 'center', py: 8, px: 4, background: '#fff0f6', fontFamily: 'Poppins' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <HomeIcon sx={{ fontSize: 80, color: '#e91e63', opacity: 0.6 }} />
        </Box>
        <Typography variant="h5" gutterBottom fontWeight="600">No listings yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start your hosting journey by creating your first property listing.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1.1rem',
            backgroundColor: '#e91e63',
            '&:hover': {
              backgroundColor: '#d81b60',
            },
            fontFamily: 'Poppins',
          }}
        >
          Create Your First Listing
        </Button>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Box>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="rectangular" width={100} height={60} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={32} />
                <Skeleton width="40%" height={24} />
              </Box>
            </Box>
            <Skeleton width="100%" height={20} />
            <Skeleton width="80%" height={20} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to right, #ffe5ec, #fcd5ce)', py: 4, fontFamily: 'Poppins' }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#e91e63' }}>
                <DashboardIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700" sx={{ color: '#e91e63' }}>
                  Host Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Manage your property listings and bookings
                </Typography>
              </Box>
            </Box>

            {listings.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip label={`${listings.length} Listing${listings.length !== 1 ? 's' : ''}`} sx={{ fontWeight: 600, borderColor: '#e91e63', color: '#e91e63' }} variant="outlined" />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNew}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 3,
                    backgroundColor: '#e91e63',
                    '&:hover': {
                      backgroundColor: '#d81b60',
                    },
                    fontFamily: 'Poppins',
                  }}
                >
                  Add New Listing
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, fontFamily: 'Poppins' }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 4, background: '#fff' }}>
          {loading ? (
            <LoadingSkeleton />
          ) : listings.length === 0 ? (
            <EmptyState />
          ) : (
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
                Your Properties
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {listings.map((listing) => (
                  <Grid item xs={12} key={listing._id}>
                    <HostListingCard listing={listing} onDelete={handleDelete} onEdit={handleEdit} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Edit Modal */}
        <Modal open={isModalOpen} onClose={handleCloseModal} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
          <Fade in={isModalOpen}>
            <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '95%', sm: '90%', md: 700 }, maxHeight: '90vh', overflow: 'auto', borderRadius: 4 }}>
              <Box sx={{ p: 3, backgroundColor: '#e91e63', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h5" fontWeight="600"><EditNoteIcon sx={{ mr: 1 }} />Edit Listing</Typography>
                  <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </Box>
              </Box>
              <Box sx={{ p: 4 }}>
                <CreateListingForm fetchListings={fetchListings} editing={editing} setEditing={setEditing} />
              </Box>
            </Paper>
          </Fade>
        </Modal>

        {/* Create Modal */}
        <Modal open={isCreateModalOpen} onClose={handleCloseCreateModal} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
          <Fade in={isCreateModalOpen}>
            <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '95%', sm: '90%', md: 700 }, maxHeight: '90vh', overflow: 'auto', borderRadius: 4 }}>
              <Box sx={{ p: 3, backgroundColor: '#e91e63', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h5" fontWeight="600"><HomeIcon sx={{ mr: 1 }} />Create New Listing</Typography>
                  <IconButton onClick={handleCloseCreateModal} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </Box>
              </Box>
              <Box sx={{ p: 4 }}>
                <CreateListingForm fetchListings={fetchListings} editing={null} setEditing={setEditing} />
              </Box>
            </Paper>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default HostDashboard;
