import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/registration";
import LoginPage from "./pages/Login";
import HomePage from "./pages/home";
import Checking from "./pages/checking";
import Profile from "./pages/profile";
import NewSeller from "./pages/newSeller";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/check" element={<Checking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sellerForm" element={<NewSeller/>} />
      </Routes>
    </Router>
  );
}

export default App;
