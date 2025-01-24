import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSellerData } from "../redux/slices/sellerSlice";
import LeftSideComponent from "../components/ProfileLeft";
import RightSideComponent from "../components/ProfileRight";
import NavComponent from "../components/Nav";
import MobileProfileLayout from "../components/MobileProfileLayour";

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <NavComponent />
      
      {/* Mobile-friendly Profile Layout */}
      <div className="md:hidden">
        <MobileProfileLayout />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden bg-gray-100">
        <div className="border-r border-gray-300 bg-white">
          <LeftSideComponent />
        </div>
        <div className="w-3/4 overflow-y-auto scrollbar-hide">
          <RightSideComponent />
        </div>
      </div>
    </div>
  );
};
export default Profile;
