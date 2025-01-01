import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const AddSellerPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    category: "",
    profileImage: null,
    location: "",
    coordinates: {
      lat: null,
      lng: null,
    },
    contact: {
      phone: "",
      whatsapp: "",
      instagram: "",
      email: "",
    },
  });

  // States for image preview and errors
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          profileImage: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (window.google) {
      const input = document.getElementById("location-search-input");
      const autocomplete = new window.google.maps.places.Autocomplete(input);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setFormData((prev) => ({
            ...prev,
            location: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          }));
        }
      });
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create FormData instance
    const formDataToSend = new FormData();

    // Append each field to the FormData instance
    formDataToSend.append("companyName", formData.companyName);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("coordinates", JSON.stringify(formData.coordinates));

    // Append contact details as well
    formDataToSend.append("contact", JSON.stringify(formData.contact));

    // Append the profile image (only if available)
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      // Send POST request with FormData to backend
      const response = await axios.post(
        `/api/sellers/register/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Specify multipart data
          },
        }
      );

      if (response.status === 201) {
        console.log("Seller added successfully:", response.data);
        setLoading(false);
        navigate("/home")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <Container className="bg-white bg-opacity-100">
      <Paper elevation={3} sx={{ p: 4, backgroundColor: "#ffffff" }}>
        <Typography variant="h4" align="center" gutterBottom color="#049b83">
          Add Seller
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 128,
                height: 128,
                borderRadius: "50%",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                "&:hover": {
                  borderColor: "#049b83",
                },
              }}
            >
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Profile preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <CameraAltIcon sx={{ fontSize: 40, color: "#ccc" }} />
              )}
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Click to upload profile image
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={3}>
            {/* Company Name */}
            <TextField
              label="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              variant="outlined"
              fullWidth
            />

            {/* Description */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                label="Category"
              >
                <MenuItem value="restaurant">Restaurant</MenuItem>
                <MenuItem value="supermarket">Supermarket</MenuItem>
                <MenuItem value="hotel">Hotel</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Location Selection with Autocomplete */}
            <TextField
              id="location-search-input"
              label="Search Location"
              variant="outlined"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              fullWidth
            />

            {/* Contact Information */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Phone"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value },
                  }))
                }
                variant="outlined"
              />
              <TextField
                label="WhatsApp"
                value={formData.contact.whatsapp}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, whatsapp: e.target.value },
                  }))
                }
                variant="outlined"
              />
              <TextField
                label="Instagram"
                value={formData.contact.instagram}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, instagram: e.target.value },
                  }))
                }
                variant="outlined"
              />
              <TextField
                label="Email"
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value },
                  }))
                }
                variant="outlined"
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#049b83",
                "&:hover": {
                  backgroundColor: "#03785f",
                },
              }}
            >
              {" "}
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Add Seller"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddSellerPage;
