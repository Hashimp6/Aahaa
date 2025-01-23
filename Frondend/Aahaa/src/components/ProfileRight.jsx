import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  Heart,
  MessageCircle,
  PlusCircle,
  ShoppingCart,
  Star,
  Trash2,
  X,
} from "lucide-react";
import CreatePost from "./CreatePost";
import CreateStory from "./CreateStory";
import { useSelector } from "react-redux";
import ProductsGrid from "./ProfileProduct";

// Separate Snackbar component
const Snackbar = ({ message, type, onClose }) => {
  const baseStyles =
    "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between gap-4 min-w-[300px] transform transition-all duration-300";
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const RightSideComponent = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [activeTab, setActiveTab] = useState("posts");
  const [open, setOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const sellerData = useSelector((state) => state.seller.sellerData);
  const sellerId = sellerData._id;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, [sellerId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/post/seller/${sellerId}`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showSnackbar(
        error.response?.data?.message || "Error fetching posts",
        "error"
      );
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${API_URL}/stories/seller/${sellerId}`);
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      showSnackbar(
        error.response?.data?.message || "Error fetching stories",
        "error"
      );
    }
  };

  // Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleStoryModalOpen = () => setStoryModalOpen(true);
  const handleStoryModalClose = () => setStoryModalOpen(false);

  const showSnackbar = (message, type = "success") => {
    setSnackbar({
      open: true,
      message,
      type,
    });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const handleStorySuccess = (newStory) => {
    setStories((prevStories) => [
      ...prevStories,
      {
        id: newStory._id,
        username: sellerData.username,
        image: newStory.media,
        title: newStory.description,
      },
    ]);
    handleStoryModalClose();
    showSnackbar("Story created successfully!");
  };

  const handleDeleteStory = async (storyId) => {
    try {
      await axios.delete(`${API_URL}/stories/${storyId}`);
      setStories((prevStories) => 
        prevStories.filter((story) => story.id !== storyId)
      );
      showSnackbar("Story deleted successfully!");
    } catch (error) {
      console.error("Error deleting story:", error);
      showSnackbar(
        error.response?.data?.message || "Error deleting story",
        "error"
      );
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/post/${postId}`);
      await fetchPosts();
      showSnackbar("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      showSnackbar(
        error.response?.data?.message || "Error deleting post",
        "error"
      );
    }
  };

 



  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Stories Section */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Offers</h2>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 py-2">
            {/* Add Story Card */}
            <div className="flex-shrink-0">
              <div
                onClick={handleStoryModalOpen}
                className="w-28 h-28 rounded-lg border-2 border-dashed border-[#049b83] flex flex-col items-center justify-center cursor-pointer hover:border-[#038671] transition-colors"
              >
                <PlusCircle className="w-6 h-6 text-[#049b83] mb-1" />
                <p className="text-sm text-[#049b83] font-medium">Add Offers</p>
              </div>
            </div>
            {/* Existing Stories */}
            {stories.map((story) => (
        <div key={story.id || `story-${story._id}`} className="flex-shrink-0">
                <div className="w-28 h-28 rounded-lg overflow-hidden ring-2 ring-[#049b83] p-0.5 bg-white relative">
                  <img
                    src={story.media}
                    alt="hello"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                    <p className="text-white text-sm truncate">{story.username}</p>
                    <p className="text-white/80 text-xs truncate">{story.title}</p>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "posts"
                ? "text-[#049b83] border-b-2 border-[#049b83]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "products"
                ? "text-[#049b83] border-b-2 border-[#049b83]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Products
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {activeTab === "posts" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleOpen}
              className="px-6 py-2.5 bg-[#049b83] hover:bg-[#038671] text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Post
            </button>
          </div>
          <div className="grid grid-cols-2 mt-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300"
              >
                <div className="relative group">
                  <img
                    src={post.media}
                    alt="Post"
                    className="w-full h-36 object-cover"
                  />
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-3">
                  <div className="flex items-center mb-2 justify-between text-gray-500">
                    <button className="flex items-center gap-1 text-[#049b83] hover:text-[#038671] transition-colors duration-300">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-[#049b83] hover:text-[#038671] transition-colors duration-300">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Products Grid */}
      {activeTab === "products" && (
  <ProductsGrid/>
)}
       

       <Dialog 
                open={storyModalOpen} 
                onClose={handleStoryModalClose}
                fullWidth 
                maxWidth="sm"
            >
                <DialogTitle className="text-[#049b83]">Create New Story</DialogTitle>
                <DialogContent>
                    <CreateStory 
                        onSuccess={handleStorySuccess}
                        onClose={handleStoryModalClose}
                        showSnackbar={(message, type) => console.log(message, type)} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStoryModalClose} style={{ color: '#049b83' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <CreatePost
            onSuccess={() => {
              handleClose();
              fetchPosts(); // Refetch posts after successful creation
              showSnackbar("Post created successfully!");
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
};

export default RightSideComponent;
