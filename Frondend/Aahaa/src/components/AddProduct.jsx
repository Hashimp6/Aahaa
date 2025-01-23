import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
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
import { useSelector } from "react-redux";

const AddProduct = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL; 
  const navigate = useNavigate();
  const sellerData = useSelector((state) => state.seller.sellerData);
  const sellerId = sellerData._id;

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    productImage: null,
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
          productImage: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form fields
    if (!formData.productName || !formData.price || !formData.quantity) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!formData.productImage) {
      setError("Please upload a product image");
      setLoading(false);
      return;
    }

    // Create FormData instance
    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("productImage", formData.productImage);

    try {
      const response = await axios.post(
        `${API_URL}/product/add/${sellerId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("Product added successfully:", response.data);
        navigate(-1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: "#ffffff" }}>
        <Typography variant="h4" align="center" gutterBottom color="#049b83">
          Add Product
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Product Image Upload */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 200,
                height: 200,
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
                  alt="Product preview"
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
              Click to upload product image
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={3}>
            {/* Product Name */}
            <TextField
              label="Product Name"
              required
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productName: e.target.value,
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

            {/* Price and Quantity */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Price"
                required
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                variant="outlined"
                InputProps={{
                  startAdornment: "₹",
                }}
              />
              <TextField
                label="Quantity"
                required
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: e.target.value,
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
              disabled={loading}
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
              ) : (
                "Add Product"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;