import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sellerId = "tht677e88ad4503ab9e540c63a6";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("descr", description);
      const formData = new FormData();
      formData.append("media", mediaFile);
      formData.append("description", description);
      formData.append("seller", sellerId); // Changed from "user" to "seller"

      const response = await axios.post("/api/post/create", formData, {
        // Changed endpoint
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDescription("");
      setMediaFile(null);
      setPreview(null);
      alert("Post created successfully!");
    } catch (err) {
      console.error("Error details:", err); // Added for better debugging
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          height: 600,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Post
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ gap: 2, display: "flex", flexDirection: "column" }}
        >
          <Box>
            {preview ? (
              <Box sx={{ position: "relative" }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: 300,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                  onClick={() => {
                    setMediaFile(null);
                    setPreview(null);
                  }}
                >
                  Change
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <AddPhotoAlternateIcon
                  sx={{ fontSize: 40, color: "grey.500", mb: 1 }}
                />
                <Typography color="textSecondary">
                  Click to upload media
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            placeholder="Write your post description..."
            fullWidth
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !mediaFile}
            fullWidth
            sx={{ mt: "auto" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Post"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePost;
