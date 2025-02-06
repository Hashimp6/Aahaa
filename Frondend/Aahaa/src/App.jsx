import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import RegistrationPage from "./pages/Registration_Page";
import LoginPage from "./pages/Login";
import HomePage from "./pages/HomePage";
import Checking from "./pages/Checking_page";
import Profile from "./pages/ProfilePage";
import NewSeller from "./pages/NewSellerreg";
import SellerProfile from "./components/SellerProfile";
import CategoryGrid from "./pages/Categories";
import Categories from "./pages/Categories";
import SellersPage from "./pages/SellersPage";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import OtpVerificationPage from "./pages/OTPVerification";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (redirect to login if logged out) */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/sellerForm"
          element={
            <ProtectedRoute>
              <NewSeller />
            </ProtectedRoute>
          }
        />
        <Route path="/seller-profile/:id" element={<SellerProfile />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/search" element={<Search />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
       
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categoryList/:categoryName" element={<SellersPage />} />
        <Route path="/check" element={<Checking />} />

        {/* Root route */}
      </Routes>
    </Router>
  );
}

export default App;
