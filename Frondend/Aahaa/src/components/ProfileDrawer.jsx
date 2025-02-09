import React from "react";
import { X, Settings, Package, Store, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const ProfileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const sellerData = useSelector((state) => state.seller.sellerData);

  // Get the seller details from user object
  const hasSellerDetails = sellerData

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userLocation");
    localStorage.removeItem("locationSet");
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (hasSellerDetails) {
      navigate("/profile");
      onClose();
    } else {
      navigate("/sellerForm");
      onClose();
    }
  };

  // Get first letter for avatar
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  // Safely handle location display
  const displayLocation = () => {
    if (!user?.location) return "Set your location";
    if (typeof user.location === "string") return user.location;
    if (user.location?.address) return user.location.address;
    return "Location not available";
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>

      {/* Profile Section */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#119a6f] to-[#049b83] flex items-center justify-center">
            <span className="text-white text-xl font-semibold">
              {firstLetter}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {user?.name || "Guest"}
            </h3>
            {/* <p className="text-sm text-gray-500">{displayLocation()}</p> */}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={handleProfileClick}
              className="w-full p-3 flex items-center justify-between rounded-lg hover:bg-teal-50 text-gray-700 group"
            >
              <div className="flex items-center space-x-3">
                <Store className="text-[#119a6f]" size={20} />
                <span>
                  {hasSellerDetails ? "View Profile" : "Become a Seller"}
                </span>
              </div>
              <ChevronRight
                className="text-gray-400 group-hover:text-[#119a6f]"
                size={16}
              />
            </button>
          </li>
          <li>
            <button className="w-full p-3 flex items-center justify-between rounded-lg hover:bg-teal-50 text-gray-700 group">
              <div className="flex items-center space-x-3">
                <Package className="text-[#119a6f]" size={20} />
                <span>My Orders</span>
              </div>
              <ChevronRight
                className="text-gray-400 group-hover:text-[#119a6f]"
                size={16}
              />
            </button>
          </li>
          <li>
            <button className="w-full p-3  flex items-center justify-between rounded-lg hover:bg-teal-50 text-gray-700 group">
              <div className="flex items-center space-x-3">
                <Settings className="text-[#119a6f]" size={20} />
                <span>Settings</span>
              </div>
              <ChevronRight
                className="text-gray-400 group-hover:text-[#119a6f]"
                size={16}
              />
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-8 text-center bg-gray-200 rounded-md
               text-[#119a6f] hover:text-[#0d805c] font-medium"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t"></div>
    </div>
  );
};

export default ProfileDrawer;
