import React from "react";
import { motion } from "framer-motion";

const CategoryGrid = () => {
  const categories = [
    {
      _id: "6773bec4de83208dd8292ed4",
      name: "Veg",
      image: "https://res.cloudinary.com/dhed9kuow/image/upload/v1735638723/categories/xzgcxiaqnt5sdh2drhs7.avif",
      colorCode: "#049b83",
    },
    {
      _id: "6783dcedde83309de8293ef5",
      name: "Fruits",
      image: "../../public/puffs.png",
      colorCode: "#FF5733",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {categories.map((category, index) => (
        <motion.div
          key={category._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative h-48 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ backgroundColor: category.colorCode }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          <div className="absolute bottom-0 w-full p-3">
            <h3 className="text-lg font-bold text-white mb-1">
              {category.name}
            </h3>
            <div 
              className="w-8 h-0.5 rounded-full bg-white transform origin-left transition-all duration-300 group-hover:w-16"
            />
          </div>
          
          <div className="absolute top-2 right-2">
            <span
              className="w-2 h-2 rounded-full block"
              style={{ backgroundColor: category.colorCode }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryGrid;