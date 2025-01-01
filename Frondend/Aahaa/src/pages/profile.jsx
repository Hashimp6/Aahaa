import React from "react";
import LeftSideComponent from "../components/ProfileLeft";
import RightSideComponent from "../components/ProfileRight";

const SellerProfile = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side - Fixed */}
      <div className="w-1/4 border-r border-gray-300 bg-white">
        <LeftSideComponent />
      </div>

      {/* Right Side - Scrollable */}
      <div className="w-3/4 overflow-y-auto scrollbar-hide">
        <RightSideComponent />
      </div>
    </div>
  );
};

export default SellerProfile;
