import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import axios from "axios";

function OtpVerificationPage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      navigate('/register');
      return;
    }
    setEmail(verificationEmail);
  }, [navigate]);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use the new combined verification endpoint
      const response = await axios.post(`${API_URL}/auth/verify-otp-register`, {
        email,
        otp
      });

      if (response.status === 201) { // Note: Changed to 201 for successful registration
        console.log("Registration Completed:", response.data);

        // Store authentication data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
  console.log("user and token is ",response.data.user,response.data.token);
        // Update Redux state
        dispatch(
          login({
            user: response.data.user,
            token: response.data.token,
          })
        );

        sessionStorage.removeItem('verificationEmail'); // Clean up
        setLoading(false);
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { email });
      if (response.status === 200) {
        setError("New OTP sent successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#049b83] via-black to-[#049b83] text-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-black">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#049b83]">
          OTP Verification
        </h1>
        <p className="text-center mb-4">
          Please enter the OTP sent to {email}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Enter OTP"
            name="otp"
            value={otp}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{ backgroundColor: "#049b83", color: "white" }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify OTP"}
          </Button>
          
          <Button
            variant="text"
            onClick={handleResendOtp}
            fullWidth
            style={{ color: "#049b83" }}
          >
            Resend OTP
          </Button>
          
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default OtpVerificationPage;