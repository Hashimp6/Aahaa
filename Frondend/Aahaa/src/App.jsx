import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import RegistrationPage from "./pages/Registration_Page";
import LoginPage from "./pages/Login";
import HomePage from "./pages/HomePage";
import Checking from "./pages/Checking_page";
import Profile from "./pages/ProfilePage";
import NewSeller from "./pages/NewSellerreg";
import SellerProfile from "./components/SellerProfile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/check" element={<Checking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sellerForm" element={<NewSeller />} />
        <Route path="/seller-profile/:id" element={<SellerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
