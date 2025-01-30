import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Store, MapPin, Star, ArrowRight } from "lucide-react";
import axios from "axios";

const SellerGrid = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { categoryName } = useParams();
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoading(true);
      try {
        // Fallback to default coordinates if user location not available
        const defaultCoordinates = [0, 0]; // Replace with your default location
        const coordinates = user?.location?.coordinates || defaultCoordinates;

        const [latitude, longitude] = coordinates;

        const response = await axios.get(
          `${API_URL}/search/sellers-by-category`,
          {
            params: {
              latitude,
              longitude,
              category: categoryName,
            },
          }
        );

        setSellers(response.data.sellers || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setSellers([]);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, [categoryName, user]);

  const handleClick = (seller) => {
    navigate(`/seller-profile/${seller._id}`, {
      state: { sellerData: seller },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex justify-center items-center">
        <p>Loading sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] bg-red-50 flex justify-center items-center">
        <p className="text-red-600">
          Failed to load sellers. Please try again.
        </p>
      </div>
    );
  }

  if (!sellers || sellers.length === 0) {
    return (
      <div className="w-full min-h-[60vh] bg-gradient-to-br from-white to-gray-50 rounded-xl flex justify-center items-center p-8">
        <div className="text-center space-y-3">
          <Store size={48} className="mx-auto text-gray-400" />
          <p className="text-xl font-medium text-gray-600">
            No sellers found in this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-white">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 p-2 gap-3 lg:gap-6">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            onClick={() => handleClick(seller)}
            className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative h-40">
              <img
                src={seller.profileImage || "../../public/Unknown_Member.jpg"}
                alt={seller.companyName}
                className="w-full h-full object-cover"
              />
              {/* Rating Badge */}
              {/* <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Star size={16} className="text-yellow-500" />
                <span className="text-gray-700 font-semibold">
                  {seller.rating || "N/A"}
                </span>
              </div> */}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-2 bg-white group-hover:bg-gray-50/50 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-800">
                {seller.companyName}
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <Store
                    size={14}
                    className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300"
                  />
                  <span className="truncate">
                    {seller.category || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <MapPin
                    size={14}
                    className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300"
                  />
                  <span className="truncate">{seller.place}</span>
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
