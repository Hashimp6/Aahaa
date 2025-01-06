import React from "react";
import {
  Instagram,
  WhatsApp,
  Call,
  Email,
  LinkedIn,
  Settings, // Importing the settings icon
  AddPhotoAlternate, // Importing the add photo icon
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LeftSideComponent = () => {
  const navigate = useNavigate();
  const sellerData = useSelector((state) => state.seller.sellerData);
  return (
    <div className="flex flex-col bg-white text-black p-5 h-screen ">
      {/* Profile Image */}
      <div className="flex justify-center mb-6 relative">
        <img
          src="../../public/puffs.png" // Replace with actual image URL
          alt="Profile"
          className="rounded-full w-32 h-32 border-4 border-gray-300"
        />
      </div>

      {/* User Profile */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{sellerData.companyName}</h1>
        <p className="text-lg text-gray-600 mb-1">{sellerData.category}</p>
        <p className="text-sm text-gray-500">{sellerData.description}</p>
      </div>

      {/* Links Section */}
      <div className="flex flex-col gap-4">
        {/* Instagram */}
        <a
          href={sellerData.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-md"
          style={{
            background:
              "linear-gradient(45deg, #f09433, #f5dc60, #e6683c, #dc2743, #cc2366, #bc1888)",
          }}
        >
          <Instagram /> Instagram
        </a>

        {/* WhatsApp */}
        <a
          href={sellerData.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-white bg-green-500 px-4 py-2 rounded-md"
        >
          <WhatsApp /> WhatsApp
        </a>

        {/* Call */}
        <a
          href={sellerData.contact.phone}
          className="flex items-center justify-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-md"
        >
          <Call /> Call
        </a>

        {/* Email */}
        <a
          href={sellerData.contact.email}
          className="flex items-center justify-center gap-2 text-white bg-red-500 px-4 py-2 rounded-md"
        >
          <Email /> Email
        </a>
      </div>

      {/* Settings Button (Placed Below Contact Links) */}
      <div className="flex justify-between mt-6">
        <button  onClick={()=>{ navigate("/sellerForm")}}
          className="flex items-center justify-center gap-2 text-black bg-gray-200 p-4 rounded-full"
          aria-label="Settings"
        >
          <Settings className="text-black" />
          <span className="text-sm">Edit Profile</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 text-white bg-purple-600 p-4 rounded-full"
          aria-label="Add Post"
        >
          <AddPhotoAlternate className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default LeftSideComponent;
