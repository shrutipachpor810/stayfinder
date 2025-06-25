import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; 
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatbot from "./components/FloatingChatbot";
import CommunityPage from "./pages/CommunityPage";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ListingDetails from "./pages/ListingDetails";
import FavoritesPage from "./pages/FavoritesPage";



// Host Pages
import HostDashboard from "./pages/host/Dashboard";
import CreateListingForm from "./pages/host/CreateListingForm";
import MyListings from "./pages/host/MyListings";
import Analytics from "./pages/host/Analytics";

// ⛳ Get PayPal Client ID from environment
const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const App = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/community" element={<CommunityPage/>} />

          {/* User Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Host Protected */}
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute role="host">
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/create"
            element={
              <ProtectedRoute role="host">
                <CreateListingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings"
            element={
              <ProtectedRoute role="host">
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/analytics"
            element={
              <ProtectedRoute role="host">
                <Analytics />
              </ProtectedRoute>
            }
          />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
        <FloatingChatbot /> {/* ✅ FLOATING CHATBOT AT ROOT */}
      </Router>
    </PayPalScriptProvider>
  );
};

export default App;
