import React from "react";

import CategoryGrid from "./Categories";
import SellerGrid from "../components/SellerGrid";
import TrapezoidSidebar from "../components/SideOptions";
import SidebarComponent from "../components/SideOptions";
import AddCategoryModal from "../components/AddCategory";

const Checking = () => {
  return (
    <div className="flex h-screen bg-gray-100">
     <AddCategoryModal/>
    </div>
  );
};

export default Checking;
