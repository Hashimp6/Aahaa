import React from "react";
import NavComponent from "../components/Nav";
import CategoryList from "../components/LeftCategory";
import SellerList from "../components/SellersCard";

function HomePage() {
  return (
    <div className="fixed w-full">
      {/* Add Navbar */}
      <NavComponent />

      <div className="flex  ">
        {/* Left Side: Category List */}
        <div className="w-25 bg-gray-100 p-2 h-screen overflow-y-auto">
          <CategoryList />
        </div>

        {/* Right Side: Seller List */}
        <div className="w-full p-2  overflow-y-auto">
          <SellerList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
