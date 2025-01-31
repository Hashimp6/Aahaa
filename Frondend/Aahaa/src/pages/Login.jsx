import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // Import useDispatch from react-redux
import { login } from "../redux/slices/authSlice"; // Import login action from the authSlice

function LoginPage() {
  // State for form fields
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State for error handling
  const [error, setError] = useState(null);

  // Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  // Get the dispatch function from useDispatch
  const dispatch = useDispatch();

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
      console.log("api is", API_URL);
      // Make API call to login endpoint
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        setLoading(false);

        // Dispatch the login action with the token and user data
        dispatch(
          login({
            user: response.data.user,
            token: response.data.token,
          })
        );

        // Store token in localStorage (if you need it for persistent login)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to the dashboard or homepage
        navigate("/home");
      }
    } catch (err) {
      if (err.response) {
        // If there's a response error from the server
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
      } else {
        // If no response was received or network error
        setError("An error occurred. Please try again later.");
      }
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#049b83] via-black to-[#049b83] text-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-black">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#049b83]">
          Login
        </h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
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
              "Login"
            )}
          </Button>
          {/* Error message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {/* Not Registered Link */}
          <div className="text-center mt-4">
            <p>
              Not Registered?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#049b83] hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
