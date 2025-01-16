import React, { useState } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateStory = ({ onSuccess, onClose, showSnackbar }) => {
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
    setError("");

    if (!description.trim() || !mediaFile) {
      setError("Please provide both a description and media file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("seller", sellerData._id);
    formData.append("file", mediaFile);

    try {
      const response = await axios.post("/api/stories/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      showSnackbar("Story posted successfully!", "success");
      setDescription("");
      setMediaFile(null);
      setPreview(null);
      onSuccess(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create story");
      showSnackbar(
        error.response?.data?.message || "Failed to create story",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create New Story
          </h2>

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
                placeholder="Write your story description..."
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
                  <span>Creating Story...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Share Story</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;