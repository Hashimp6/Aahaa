import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categorySlice";
import { useNavigate } from "react-router-dom";

const CategoryGrid = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL; 
  const [loading, setLoading] = useState(true);
  const categories = useSelector((state) => state.category.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/all`);
        dispatch(setCategories(response.data.categories));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleCategoryClick = (categoryName) => {
    // Navigate to the category page, passing the category name in the URL
    navigate(`/categoryList/${categoryName}`);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-36 sm:h-40 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: category.colorCode }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute bottom-0 w-full p-3">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1 truncate">
                  {category.name}
                </h3>
                <div className="w-6 h-0.5 rounded-full bg-white/80 transform origin-left transition-all duration-300 group-hover:w-12 group-hover:bg-white" />
              </div>

              <div className="absolute top-2 right-2">
                <span
                  className="w-1.5 h-1.5 rounded-full block"
                  style={{ backgroundColor: category.colorCode }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
