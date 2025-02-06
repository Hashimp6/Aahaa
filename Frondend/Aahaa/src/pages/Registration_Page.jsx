import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation to Login page
import axios from "axios";

function RegistrationPage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  // State for form fields
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State for error handling
  const [error, setError] = useState(null);

  // Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First register the user
      const registerResponse = await axios.post(`${API_URL}/auth/register`, formData);

      if (registerResponse.status === 201) {
        // After successful registration, send OTP
        const otpResponse = await axios.post(`${API_URL}/otp/send-otp`, {
          email: formData.email
        });

        if (otpResponse.status === 200) {
          console.log("Registration and OTP sending successful");
          // Store email in sessionStorage for OTP verification page
          sessionStorage.setItem('verificationEmail', formData.email);
          setLoading(false);
          navigate("/otp-verification");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#049b83] via-black to-[#049b83] text-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-black">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#049b83]">
          Registration
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            type="email"
            fullWidth
          />
          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            type="password"
            fullWidth
          />
          {/* Submit Button */}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{
              backgroundColor: "#049b83",
              color: "white",
            }}
            className="hover:bg-[#03785f]"
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Register"
            )}
          </Button>

          {/* Error message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Already Registered Link */}
          <div className="text-center mt-4">
            <p>
              Already Registered?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#049b83] hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
