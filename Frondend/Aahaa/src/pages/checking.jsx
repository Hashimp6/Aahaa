import React from "react";

import LeftSideUserComponent from "../components/LeftUserComponent";
import AddProduct from "../components/AddProduct";

const Checking = () => {
  return (
    <div className="flex h-screen bg-gray-100">
    {/* Left Side - Fixed */}
    {/* <div className="w-1/4 border-r border-gray-300 bg-white">
      <LeftSideUserComponent />
    </div> */}

   <AddProduct/>
  </div>
  );
};

export default Checking;
