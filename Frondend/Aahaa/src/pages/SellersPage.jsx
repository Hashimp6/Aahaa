import React from "react";
import SellerGrid from "../components/SellerGrid";
import SidebarComponent from "../components/SideOptions";
import NavComponent from "../components/Nav";

function SellersPage() {
  return (
    <div className="fixed w-full">
      <NavComponent />

      <div className="flex">
        {/* Left Side: Category List */}
        <SidebarComponent />

        {/* Right Side: Seller List */}
        <div className="w-full p-2 overflow-y-auto">
          <SellerGrid />
        </div>
      </div>
    </div>
  );
}

export default SellersPage;
