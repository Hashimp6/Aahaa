import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categorySlice"; // Adjust the path if needed

const CategoryList = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const categories = useSelector((state) => state.category.categories); // Access categories from Redux
  const dispatch = useDispatch(); // Dispatch function to update Redux store

  // Fetch categories from backend using Axios
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/all");
        dispatch(setCategories(response.data.categories)); // Dispatch to store categories in Redux
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchCategories(); // Call the function to fetch categories
  }, [dispatch]); // Ensure dispatch is stable and does not cause infinite loops

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div
      className="max-w-sm mx-auto p-2 space-y-4"
      style={{
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For Internet Explorer
      }}
    >
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-20 h-20 overflow-hidden">
              <img
                src={category.image} // Image URL from backend
                alt={category.name}
                className="w-full h-full object-cover rounded-full shadow-md 
                             transform group-hover:scale-105 transition-transform duration-300 
                             border-2 border-gray-100 group-hover:border-green-400"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                                rounded-full group-hover:from-black/10 transition-all duration-300"
              />
            </div>
            <h3
              className="mt-1 text-lg font-medium text-gray-800 group-hover:text-green-600 
                             transition-colors duration-300"
            >
              {category.name}
            </h3>
          </div>
        ))
      ) : (
        <div>No categories available.</div> // Show message if no categories are available
      )}

      {/* Inline CSS to hide the scrollbar */}
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;
