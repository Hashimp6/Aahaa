import React, { useState, useRef } from "react";
import axios from "axios";
import {
  CircularProgress,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const AddCategoryModal = ({ onClose }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !colorCode || !image) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("colorCode", colorCode);
    formData.append("image", image); // Upload the image file

    try {
      setLoading(true);
      // Make sure the URL matches the correct backend route
      const response = await axios.post(
       ` ${ API_URL }/category/add`, // Adjust to the correct API route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the correct content type is set
          },
        }
      );
      alert("Category added successfully!");
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Add Category
        </Typography>
        <form onSubmit={handleSubmit}>
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
              "&:hover": { borderColor: "#049b83" },
              mb: 2,
            }}
          >
            {imagePreview ? (
              <Box
                component="img"
                src={imagePreview}
                alt="Category preview"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Color Code"
            variant="outlined"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            style={{
              background: "#049b83",
              color: "#fff",
            }}
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCategoryModal;
