import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OtpVerificationPage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle OTP input change
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { otp });

      if (response.status === 200) {
        console.log("OTP Verified:", response.data);
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#049b83] via-black to-[#049b83] text-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-black">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#049b83]">
          OTP Verification
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Enter OTP"
            name="otp"
            value={otp}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{ backgroundColor: "#049b83", color: "white" }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify OTP"}
          </Button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default OtpVerificationPage;
