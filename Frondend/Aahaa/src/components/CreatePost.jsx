import React, { useState } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreatePost = ({ onSuccess }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get seller ID from Redux store
  const sellerData = useSelector((state) => state.seller.sellerData);

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
      if (!mediaFile) {
        throw new Error("Please select a media file");
      }

      const formData = new FormData();
      formData.append("media", mediaFile);
      formData.append("description", description);
      formData.append("seller", sellerData._id);

      const response = await axios.post(`${API_URL}/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Reset form
        setDescription("");
        setMediaFile(null);
        setPreview(null);
        
        // Call the onSuccess callback
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-1">
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {preview ? (
                <div className="relative rounded-lg overflow-hidden group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setMediaFile(null);
                        setPreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="relative block">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:border-[#038671] transition-colors duration-300 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <div className="p-3 bg-green-50 rounded-full">
                        <ImagePlus className="w-6 h-6 text-[#038671]" />
                      </div>
                      <p className="font-medium">Drop your media here</p>
                      <p className="text-sm">or click to browse</p>
                    </div>
                  </div>
                </label>
              )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-[120px] p-3 rounded-lg border border-gray-200 focus:border-[#038671] focus:ring-1 focus:ring-[#038671] outline-none resize-none"
              />

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !mediaFile}
              className="w-full bg-[#038671] hover:bg-[#026957] text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Share Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;