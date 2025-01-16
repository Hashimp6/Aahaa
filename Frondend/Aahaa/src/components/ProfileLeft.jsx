import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Instagram,
  MessageSquare,
  Phone,
  Mail,
  Settings,
  ImagePlus,
} from "lucide-react";

const LeftSideComponent = () => {
  const navigate = useNavigate();
  const sellerData = useSelector((state) => state.seller.sellerData) || {
    companyName: "Default Company",
    category: "Default Category",
    description: "Default Description",
    contact: {
      instagram: "https://instagram.com/default",
      whatsapp: "https://wa.me/1234567890",
      phone: "1234567890",
      email: "default@example.com",
    },
  };

  return (
    <div className="flex flex-col bg-white text-black p-3 md:p-5 h-full min-h-screen max-w-md mx-auto md:max-w-none">
      {/* Profile Section */}
      <div className="space-y-6 mb-6">
        {/* Profile Image */}
        <div className="flex justify-center relative">
          <img
            src="../../public/puffs.png"
            alt="Profile"
            className="rounded-full w-24 h-24 md:w-32 md:h-32 border-4 border-gray-300 object-cover"
          />
        </div>

        {/* User Info */}
        <div className="text-center space-y-2">
          <h1 className="text-xl md:text-2xl font-bold">
            {sellerData.companyName}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {sellerData.category}
          </p>
          <p className="text-sm text-gray-500 px-4">{sellerData.description}</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 justify-center mb-6">
        <a
          href={sellerData.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg text-sm md:text-base transition-transform hover:scale-105"
          style={{
            background:
              "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
          }}
        >
          <Instagram className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden md:inline">Instagram</span>
        </a>
        <a
          href={sellerData.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-white bg-green-500 px-4 py-2 rounded-lg text-sm md:text-base transition-transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden md:inline">WhatsApp</span>
        </a>
        <a
          href={`tel:${sellerData.contact.phone}`}
          className="flex items-center justify-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg text-sm md:text-base transition-transform hover:scale-105"
        >
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden md:inline">Call</span>
        </a>
        <a
          href={`mailto:${sellerData.contact.email}`}
          className="flex items-center justify-center gap-2 text-white bg-red-500 px-4 py-2 rounded-lg text-sm md:text-base transition-transform hover:scale-105"
        >
          <Mail className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden md:inline">Email</span>
        </a>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <button
          onClick={() => navigate("/sellerForm")}
          className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          <span className="text-xs md:text-sm mt-1">Edit Profile</span>
        </button>

       
      </div>
    </div>
  );
};

export default LeftSideComponent;
