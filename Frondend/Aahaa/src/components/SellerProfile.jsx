import React, { useState } from "react";
import {
  Instagram,
  WhatsApp,
  Call,
  Email,
  Settings,
  AddPhotoAlternate,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const SellerProfile = () => {
  const location = useLocation();
  const { sellerData } = location.state || {};

  const [activeTab, setActiveTab] = useState("posts");

  // Dummy stories data (replace with actual data)
  const stories = [
    {
      id: 1,
      image: "../../public/puffs.png",
      username: "John Doe",
      title: "Exciting Announcement!",
    },
    {
      id: 2,
      image: "../../public/puffs.png",
      username: "Jane Smith",
      title: "New Product Launch!",
    },
    {
      id: 3,
      image: "../../public/puffs.png",
      username: "Alice Cooper",
      title: "Seasonal Sale!",
    },
  ];

  if (!sellerData) {
    return <p>Loading...</p>;
  }

  console.log("seller data in component", sellerData);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Left Side - Fixed Profile Section */}
      <div className="w-1/3 border-r border-gray-300 bg-white p-5 flex flex-col items-center">
        <img
          src={sellerData.profileImage}
          alt="Profile"
          className="rounded-full w-32 h-32 border-4 border-gray-300 mb-6"
        />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{sellerData.companyName}</h1>
          <p className="text-lg text-gray-600">{sellerData.category}</p>
          <p className="text-sm text-gray-500">{sellerData.description}</p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-col gap-4 w-full">
          <a
            href={sellerData.contact.instagram}
            className="text-white bg-gradient-to-r from-pink-500 to-yellow-500 px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <Instagram /> Instagram
          </a>
          <a
            href={`https://wa.me/${sellerData.contact.whatsapp}`}
            className="text-white bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <WhatsApp /> WhatsApp
          </a>
          <a
            href={`tel:${sellerData.contact.phone}`}
            className="text-white bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <Call /> Call
          </a>
          <a
            href={`mailto:${sellerData.contact.email}`}
            className="text-white bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <Email /> Email
          </a>
        </div>

        {/* Settings and Add Post Buttons */}
        <div className="flex justify-between mt-6 w-full">
          <button className="flex items-center gap-2 text-black bg-gray-200 px-4 py-2 rounded-full">
            <Settings /> Edit Profile
          </button>
          <button className="flex items-center gap-2 text-white bg-purple-600 px-4 py-2 rounded-full">
            <AddPhotoAlternate /> Add Post
          </button>
        </div>
      </div>

      {/* Right Side - Scrollable Section for Posts and Products */}
      <div className="w-2/3 p-6 overflow-y-auto bg-white">
        {/* Stories Section */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 py-4">
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <div className="w-40 h-40 rounded-lg overflow-hidden ring-2 ring-purple-500 p-0.5 bg-white relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-sm truncate">
                      {story.username}
                    </p>
                    <p className="text-white/80 text-xs truncate">
                      {story.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`${
              activeTab === "posts"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            } px-4 py-2`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`${
              activeTab === "products"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            } px-4 py-2`}
          >
            Products
          </button>
        </div>

        {/* Posts Section */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-2 gap-4">
            {sellerData.posts.length > 0 ? (
              sellerData.posts.map((post, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    {post.description}
                  </p>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        )}

        {/* Products Section */}
        {activeTab === "products" && (
          <div className="grid grid-cols-2 gap-4">
            {sellerData.products.length > 0 ? (
              sellerData.products.map((product, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-lg font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
