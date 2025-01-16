// CreateStory.js
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";

const CreateStory = ({ onSuccess, onClose, showSnackbar }) => {
    const [description, setDescription] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const sellerData = useSelector((state) => state.seller.sellerData);

    // Handle file selection
    const handleFileChange = (e) => {
        setMediaFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !mediaFile) {
            showSnackbar("Please fill all fields and upload a file!", "error");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("description", description);
        formData.append("seller", sellerData._id);
        formData.append("file", mediaFile);

        try {
            const response = await axios.post("/api/stories/create", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showSnackbar("Story posted successfully!", "success");
            setDescription("");
            setMediaFile(null);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            showSnackbar(error.response?.data?.message || "Failed to create story", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <form 
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Description Input */}
                <textarea
                    className="w-full border-2 border-teal-300 p-3 rounded-md focus:outline-none focus:border-teal-500"
                    rows="4"
                    placeholder="Write a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                {/* File Upload */}
                <div>
                    <label className="block mb-2 text-teal-600 font-medium">Upload Media</label>
                    <input
                        type="file"
                        className="w-full border-2 border-teal-300 p-2 rounded-md focus:outline-none cursor-pointer"
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 bg-[#049b83] text-white font-bold rounded-md hover:bg-[#038671] transition-all ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Posting..." : "Post Story"}
                </button>
            </form>
        </div>
    );
};

export default CreateStory;