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
  Alert,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setSellerData } from '../redux/slices/sellerSlice';
import { useDispatch, useSelector } from "react-redux";

const SellerForm = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const sellerData = useSelector((state) => state.seller.sellerData);

  const userId = user?._id;
  const isUpdate = sellerData !== null && sellerData !== undefined;
  const sellerId = isUpdate ? sellerData._id : null;
  const categories = [
    "Mehandi",
    "Hambers",
    "Calligraphy",
    "Potraits",
    "Makeup",
    "Photography",
    "Hair",
    "Tattoo",
    "Cakes",
    "Wood",
    "Boutique",
    "Resin",
    "Tailoring",
    "Sweets",
    "Restaurant"
  ];
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

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (sellerData && Object.keys(sellerData).length > 0) {
      setFormData({
        companyName: sellerData.companyName || "",
        description: sellerData.description || "",
        category: sellerData.category || "",
        location: sellerData.location || "",
        coordinates: {
          lat: sellerData.location?.coordinates?.[1] || null,
          lng: sellerData.location?.coordinates?.[0] || null,
        },
        contact: {
          phone: sellerData.contact?.phone || "",
          whatsapp: sellerData.contact?.whatsapp || "",
          instagram: sellerData.contact?.instagram || "",
          email: sellerData.contact?.email || "",
        },
      });

      if (sellerData.profileImage) {
        setImagePreview(sellerData.profileImage);
      }
    }
  }, [sellerData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("location from frnd ends", formData.location);
      if (!userId) {
        throw new Error("User not found. Please login again.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("location", formData.location);
      formDataToSend.append(
        "coordinates",
        JSON.stringify(formData.coordinates)
      );
      formDataToSend.append("contact", JSON.stringify(formData.contact));

      if (formData.profileImage && typeof formData.profileImage !== "string") {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      let response;

      if (isUpdate && sellerId) {
        response = await axios.patch(
          `${API_URL}/sellers/${sellerId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        dispatch(setSellerData(response.data.seller));
      } else {
        response = await axios.post(
          `${API_URL}/sellers/register/${userId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        dispatch(setSellerData(response.data.seller));
      }

      if (response.status === 200 || response.status === 201) {
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="bg-white bg-opacity-100">
      <Paper elevation={3} sx={{ p: 4, backgroundColor: "#ffffff" }}>
        <Typography variant="h4" align="center" gutterBottom color="#049b83">
          {isUpdate ? "Update Seller Details" : "Add Seller"}
        </Typography>

        <form onSubmit={handleSubmit}>
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
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
           
            {!sellerData && (
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
)}
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
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : isUpdate ? (
                "Update Seller"
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

export default SellerForm;
