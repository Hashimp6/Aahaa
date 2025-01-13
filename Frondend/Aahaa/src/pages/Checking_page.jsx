import React from "react";

import CategoryGrid from "./Categories";
import SellerGrid from "../components/SellerGrid";
import TrapezoidSidebar from "../components/SideOptions";
import SidebarComponent from "../components/SideOptions";
import AddCategoryModal from "../components/AddCategory";
import CreatePost from "../components/CreatePost";

const Checking = () => {
  return (
    <div className="flex h-screen bg-gray-100">
     <CreatePost/>
    </div>
  );
};

export default Checking;
