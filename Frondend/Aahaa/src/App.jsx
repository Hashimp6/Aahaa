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
import SellerGrid from "./components/SellerGrid";
import SellersPage from "./pages/SellersPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest-only routes (redirect to home if logged in) */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegistrationPage />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        {/* Protected routes (redirect to login if logged out) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
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
        <Route
          path="/sellerForm"
          element={
            <ProtectedRoute>
              <NewSeller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-profile/:id"
          element={
            <ProtectedRoute>
              <SellerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route path="/categoryList/:categoryName" element={<SellersPage/>} />
        <Route
          path="/check"
          element={
            <ProtectedRoute>
              <Checking />
            </ProtectedRoute>
          }
        />

        {/* Root route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
