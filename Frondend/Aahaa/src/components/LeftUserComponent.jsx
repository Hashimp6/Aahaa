import React from "react";
import { useSelector } from "react-redux";
import { Favorite, ShoppingCart } from "@mui/icons-material";

const LeftSideUserComponent = () => {
    const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col bg-white text-black p-5 h-screen">
      {/* Profile Image */}
      <div className="flex justify-center mb-6 relative">
        <img
          src={user?.profileImage || "../../public/default-profile.png"} 
          alt="Profile"
          className="rounded-full w-32 h-32 border-4 border-gray-300"
        />
      </div>

      {/* User Name and Address */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{user?.name || "N/A"}</h1>
        <p className="text-lg text-gray-600">{user?.address || "Address not available"}</p>
      </div>

      {/* Orders and Favorites Buttons */}
      <div className="flex flex-col gap-4">
        {/* Orders Button */}
        <button
          className="flex items-center justify-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-md"
        >
          <ShoppingCart /> Orders
        </button>

        {/* Favorites Button */}
        <button
          className="flex items-center justify-center gap-2 text-white bg-red-500 px-4 py-2 rounded-md"
        >
          <Favorite /> Favorites
        </button>
      </div>
    </div>
  );
};

export default LeftSideUserComponent;
