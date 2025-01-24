import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Instagram,
  MessageSquare,
  Phone,
  Mail,
  Settings,
  LogOut,
  ClipboardList
} from "lucide-react";

const LeftSideComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const handleSignOut = () => {
    // dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-xl p-6 h-full">
      {/* Header with Profile */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-teal-500 to-teal-600  -mx-6 -mt-6" />
        
        <div className="relative flex flex-col items-center">
          <img
            src={sellerData.profileImage}
            alt="Profile"
            className="rounded-full w-28 h-28 border-4 border-white shadow-md object-cover mt-4"
          />
          <h1 className="text-xl font-bold text-gray-800 mt-3">
            {sellerData.companyName}
          </h1>
          <p className="text-base text-teal-600 font-medium">
            {sellerData.category}
          </p>
          <p className="text-sm text-gray-600 text-center mt-2 max-w-sm">
            {sellerData.description}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="flex flex-col items-center p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all hover:shadow-md"
        >
          <ClipboardList className="w-6 h-6 text-teal-600" />
          <span className="text-sm mt-1 text-teal-600 font-medium">Orders</span>
        </button>
        <button
          onClick={() => navigate("/sellerForm")}
          className="flex flex-col items-center p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all hover:shadow-md"
        >
          <Settings className="w-6 h-6 text-teal-600" />
          <span className="text-sm mt-1 text-teal-600 font-medium">Settings</span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all hover:shadow-md"
        >
          <LogOut className="w-6 h-6 text-red-500" />
          <span className="text-sm mt-1 text-red-500 font-medium">Logout</span>
        </button>
      </div>

      {/* Contact Links */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Contact Information</h2>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={sellerData.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
            style={{
              background: "linear-gradient(45deg, #f09433, #e6683c 75%, #dc2743)",
            }}
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">Instagram</span>
          </a>
          <a
            href={sellerData.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500 text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">WhatsApp</span>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${sellerData.contact.phone}`}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-teal-500 text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">Call</span>
          </a>
          <a
            href={`mailto:${sellerData.contact.email}`}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-teal-600 text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftSideComponent;