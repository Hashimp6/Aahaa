import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,  } from "react-router-dom";
import axios from "axios";
import { Star, Store, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import {
  fetchSellersStart,
  fetchSellersSuccess,
  fetchSellersFailure,
} from "../redux/slices/listOfSellers";

const SellerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { nearestSellers, loading, error } = useSelector(
    (state) => state.listOfSellers
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user?.location?.coordinates?.length === 2) {
      const [longitude, latitude] = user.location.coordinates;
      dispatch(fetchSellersStart());
      axios
        .get("/api/search/nearest-sellers", {
          params: { latitude, longitude, page },
        })
        .then((response) => {
          const sellers = response.data.sellers;
          dispatch(fetchSellersSuccess(sellers));
          if (sellers.length < 50) {
            setHasMore(false);
          }
        })
        .catch((err) => {
          dispatch(fetchSellersFailure(err.message));
        });
    }
  }, [user, page, dispatch]);

  const handleClick = (seller) => {
    navigate(`/seller-profile/${seller._id}`, {
      state: { sellerData: seller },
    });
  };

  const loadMoreSellers = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Location not available";
    if (typeof location === "string") return location;
    if (location.address) return location.address;
    if (location.coordinates) {
      return `${location.coordinates[1].toFixed(
        2
      )}°N, ${location.coordinates[0].toFixed(2)}°E`;
    }
    return "Location not available";
  };

  if (!user?.location?.coordinates || user.location.coordinates.length !== 2) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
          Location information not available
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white text-gray-600 px-6 py-4 rounded-lg shadow-sm">
          Loading sellers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {nearestSellers.map((seller) => (
          <li
            key={seller._id}
            onClick={() => handleClick(seller)}
            className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] border border-gray-200 hover:border-gray-200"
          >
            <div className="absolute inset-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300" />

            <div className="relative z-10">
              {/* Image Container */}
              <div className="relative h-40 group-hover:brightness-[1.02] transition-all duration-300">
                <img
                  src={seller.profileImage}
                  alt={seller.companyName}
                  className="w-full h-full object-cover"
                />
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm group-hover:bg-white/95 transition-colors duration-300">
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-gray-700 font-medium text-xs">
                    {seller.rating || "N/A"}
                  </span>
                </div>
                {/* Distance Badge */}
                <div className="absolute top-3 left-3 bg-[#049b83]/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-medium shadow-sm group-hover:bg-[#049b83]/95 transition-colors duration-300">
                  {typeof seller.distance === "number"
                    ? `${seller.distance.toFixed(1)}km`
                    : seller.distance || "N/A"}
                </div>
              </div>

              {/* Content */}
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
                    <span className="truncate">
                      {formatLocation(seller.location)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <button className="w-full bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-white/90 transition-colors duration-300">
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMoreSellers}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-3 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 font-medium"
          >
            <span>Load More</span>
            <ChevronDown size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerList;
