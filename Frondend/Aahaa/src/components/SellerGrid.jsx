import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import redux hooks
import axios from "axios";

const SellerGrid = () => {
  const { categoryName } = useParams();
  const [sellers, setSellers] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = user.location.coordinates;

  useEffect(() => {
    // Check if user coordinates are available
    if (location) {
      const fetchSellers = async () => {
        try {
          const [latitude, longitude ] = location;
          console.log("datas is ",latitude,
            longitude,
            categoryName);
          // Make the API call with category and location
          const response = await axios.get(`http://localhost:5000/api/search/sellers-by-category`, {
            params: {
              latitude,
              longitude,
              category: categoryName,
            },
          });
          // Log the sellers fetched from the API
          console.log("Sellers fetched:", response.data);
          setSellers(response.data);
        } catch (error) {
          console.error("Error fetching sellers:", error);
        }
      };

      fetchSellers();
    }
  }, [categoryName, location]); // Add `categoryName` and `userLocation` as dependencies

  const handleSellerClick = (seller) => {
    console.log("Seller clicked:", seller);
    // Add your navigation or modal opening logic here
  };
  return (
    <div className="w-full p-6 bg-gray-100 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            onClick={() => handleSellerClick(seller)}
            className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-200"
          >
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <div className="text-white flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="font-medium">View Details</span>
                <ArrowRight size={18} />
              </div>
            </div>

            {/* Image Section */}
            <div className="relative h-48">
              <img
                src={seller.profileImage}
                alt={seller.companyName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={14} className="text-yellow-400" />
                <span className="text-gray-700 text-xs font-medium">
                  {seller.rating}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {seller.companyName}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Store size={16} className="text-gray-400" />
                  <span className="truncate">{seller.category}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate">{seller.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerGrid;
