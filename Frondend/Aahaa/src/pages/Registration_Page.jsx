import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegistrationPage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Now we only need one API call to initiate registration
      const response = await axios.post(
        `${API_URL}/auth/initiate-registration`, 
        formData
      );

      if (response.status === 200) {
        // Store email for OTP verification
        sessionStorage.setItem('verificationEmail', formData.email);
        setLoading(false);
        navigate("/otp-verification");
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
