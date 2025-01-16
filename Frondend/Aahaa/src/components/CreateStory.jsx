import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateStory = ({ onSuccess, onClose, showSnackbar }) => {
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sellerData = useSelector((state) => state.seller.sellerData);
  const sellerId = sellerData._id;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

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
    formData.append("seller", sellerId);
    formData.append("file", mediaFile);

    try {
      console.log("datas like descr and seller", sellerId, description);
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
      <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create New Story
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative"
              >
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-72 object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 hover:border-emerald-500 transition-colors duration-300 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                      />
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <div className="p-4 bg-emerald-50 rounded-full">
                          <svg
                            className="w-8 h-8 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">
                          Drop your media here
                        </p>
                        <p className="text-sm">or click to browse</p>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your story description..."
                className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none text-gray-700 placeholder-gray-400"
              />

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !mediaFile}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Story...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
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
