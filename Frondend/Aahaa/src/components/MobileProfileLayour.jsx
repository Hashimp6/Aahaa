import React from "react";
import RightSideComponent from "./ProfileRight";
import { useSelector } from "react-redux";
import { Instagram } from "@mui/icons-material";
import { EditIcon, Mail, MessageSquare, Phone } from "lucide-react";
import ShareProfileButton from "./ShareProfileButton";
import { useNavigate } from "react-router-dom";

const MobileProfileLayout = () => {
  const navigate = useNavigate();
  const sellerData = useSelector((state) => state.seller.sellerData);

  return (
    <div className="bg-white">
      {/* Profile Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <img
            src={sellerData.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">{sellerData.companyName}</h1>
            <p className="text-sm text-gray-600">{sellerData.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("/sellerForm")}
            className="p-2 text-[#049b83] hover:bg-gray-100 rounded-full"
          >
            <EditIcon />
          </button>
          <ShareProfileButton sellerData={sellerData} />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-around p-4 border-b">
        <a href={sellerData.contact.instagram} target="_blank">
          <Instagram className="w-6 h-6 text-[#049b83]" />
        </a>
        <a href={sellerData.contact.whatsapp} target="_blank">
          <MessageSquare className="w-6 h-6 text-[#049b83]" />
        </a>
        <a href={`tel:${sellerData.contact.phone}`}>
          <Phone className="w-6 h-6 text-[#049b83]" />
        </a>
        <a href={`mailto:${sellerData.contact.email}`}>
          <Mail className="w-6 h-6 text-[#049b83]" />
        </a>
      </div>

      {/* Mobile Right Side Component */}
      <div className="px-4">
        <RightSideComponent isMobile={true} />
      </div>
    </div>
  );
};

export default MobileProfileLayout;
