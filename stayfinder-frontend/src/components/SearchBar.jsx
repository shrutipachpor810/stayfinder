import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
  Chip,
  Container
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  DateRange as DateRangeIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from "@mui/icons-material";

const SearchBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });

  const [setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      startDate: "",
      endDate: "",
    });
    onFilter({
      location: "",
      minPrice: "",
      maxPrice: "",
      startDate: "",
      endDate: "",
    });
  };

  const hasFilters = Object.values(filters).some(value => value !== "");

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ position: 'relative', mb: 4 }}>
        {/* Main Search Container */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 4, md: 8 },
            border: '1px solid #DDDDDD',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          {/* Mobile Header */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              Search Properties
            </Typography>
            {hasFilters && (
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            )}
          </Box>

          {/* Desktop Layout */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch' }}>
            {/* Location */}
            <Box 
              sx={{ 
                flex: 2, 
                borderRight: '1px solid #DDDDDD',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="caption" fontWeight="600" color="text.primary" sx={{ mb: 1, display: 'block' }}>
                  WHERE
                </Typography>
                <TextField
                  fullWidth
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  placeholder="Search destinations"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <LocationOnIcon sx={{ color: '#FF385C', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: '14px',
                      '& input::placeholder': {
                        color: '#717171',
                        opacity: 1
                      }
                    }
                  }}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                />
              </Box>
            </Box>

            {/* Price Range */}
            <Box 
              sx={{ 
                flex: 2, 
                borderRight: '1px solid #DDDDDD',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="caption" fontWeight="600" color="text.primary" sx={{ mb: 1, display: 'block' }}>
                  PRICE RANGE
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    placeholder="Min"
                    variant="standard"
                    type="number"
                    sx={{ flex: 1 }}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        fontSize: '14px',
                        '& input::placeholder': {
                          color: '#717171',
                          opacity: 1
                        }
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>-</Typography>
                  <TextField
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    placeholder="Max"
                    variant="standard"
                    type="number"
                    sx={{ flex: 1 }}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        fontSize: '14px',
                        '& input::placeholder': {
                          color: '#717171',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Check In / Check Out */}
            <Box 
              sx={{ 
                flex: 2, 
                borderRight: '1px solid #DDDDDD',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="caption" fontWeight="600" color="text.primary" sx={{ mb: 1, display: 'block' }}>
                  WHEN
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    type="date"
                    variant="standard"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon sx={{ color: '#2196F3', fontSize: 16 }} />
                        </InputAdornment>
                      ),
                      sx: { fontSize: '14px' }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>to</Typography>
                  <TextField
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    type="date"
                    variant="standard"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: '14px' }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Search Button */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              px: 2
            }}>
              <Button
                onClick={handleSearch}
                variant="contained"
                sx={{
                  minWidth: 48,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF385C 0%, #E31E55 100%)',
                  boxShadow: '0 2px 8px rgba(255, 56, 92, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E31E55 0%, #C13584 100%)',
                    boxShadow: '0 4px 12px rgba(255, 56, 92, 0.4)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <SearchIcon sx={{ color: 'white' }} />
              </Button>
            </Box>
          </Box>

          {/* Mobile Layout */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  label="Where to?"
                  placeholder="Search destinations"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: '#FF385C' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#FF385C',
                      },
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  label="Min Price"
                  type="number"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon sx={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  label="Max Price"
                  type="number"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon sx={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                  label="Check In"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon sx={{ color: '#2196F3' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                  label="Check Out"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon sx={{ color: '#2196F3' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                      height: 48,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #FF385C 0%, #E31E55 100%)',
                      boxShadow: '0 2px 8px rgba(255, 56, 92, 0.3)',
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E31E55 0%, #C13584 100%)',
                        boxShadow: '0 4px 12px rgba(255, 56, 92, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Search
                  </Button>
                  {hasFilters && (
                    <Button
                      variant="outlined"
                      onClick={handleClear}
                      sx={{
                        minWidth: 48,
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        borderColor: '#DDDDDD',
                        color: '#717171',
                        '&:hover': {
                          borderColor: '#FF385C',
                          backgroundColor: 'rgba(255, 56, 92, 0.04)'
                        }
                      }}
                    >
                      <ClearIcon />
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Active Filters */}
        {hasFilters && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.location && (
              <Chip
                label={`Location: ${filters.location}`}
                onDelete={() => setFilters(prev => ({ ...prev, location: '' }))}
                sx={{ borderRadius: 2 }}
              />
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Chip
                label={`Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}`}
                onDelete={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                sx={{ borderRadius: 2 }}
              />
            )}
            {(filters.startDate || filters.endDate) && (
              <Chip
                label={`Date: ${filters.startDate || 'Any'} to ${filters.endDate || 'Any'}`}
                onDelete={() => setFilters(prev => ({ ...prev, startDate: '', endDate: '' }))}
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchBar;