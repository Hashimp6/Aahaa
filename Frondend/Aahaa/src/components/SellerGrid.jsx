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
    <div className="w-full h-screen overflow-y-auto bg-gray-100">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            onClick={() => handleClick(seller)}
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6 z-10">
              <div className="text-white flex flex-col items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-medium text-lg">View Details</span>
                <ArrowRight size={24} className="animate-pulse" />
              </div>
            </div>

            {/* Image Section */}
            <div className="relative h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <img
                src={seller.profileImage || "/placeholder-image.jpg"}
                alt={seller.companyName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Star size={16} className="text-yellow-500" />
                <span className="text-gray-700 font-semibold">
                  {seller.rating || "N/A"}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-2 space-y-1 bg-white">
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {seller.companyName}
              </h3>
              <div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className=" bg-gray-100 rounded-lg">
                    <Store size={16} className="text-gray-500" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {seller.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className=" bg-gray-100 rounded-lg">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {seller.location && seller.location.coordinates
                      ? `${seller.location.coordinates[0].toFixed(
                          4
                        )}, ${seller.location.coordinates[1].toFixed(4)}`
                      : "Location not available"}
                  </span>
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
