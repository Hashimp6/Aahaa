import React from "react";
import CategoryGrid from "../components/CategoryList";
import NavComponent from "../components/Nav";

function Categories() {
  return (
    <div>
        <NavComponent/>
      <CategoryGrid />
    </div>
  );
}

export default Categories;
