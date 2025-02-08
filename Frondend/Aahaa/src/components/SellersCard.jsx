import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, Store, MapPin, ArrowRight, ChevronDown, Heart } from "lucide-react";
import {
  fetchSellersStart,
  fetchSellersSuccess,
  fetchSellersFailure,
} from "../redux/slices/listOfSellers";

const SellerList = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.listOfSellers);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [nearSeller, setNearSeller] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoize the fetchSellers function
  const fetchSellers = useCallback(async (pageNum) => {
    let latitude, longitude;

    if (user?.location?.coordinates?.length === 2) {
      [longitude, latitude] = user.location.coordinates;
    } else {
      const userLoc = localStorage.getItem("userLocation");
      if (userLoc) {
        const parsedLocation = JSON.parse(userLoc);
        latitude = parsedLocation.lat;
        longitude = parsedLocation.lng;
      } else {
        latitude = 0;
        longitude = 0;
      }
    }

    try {
      const response = await axios.get(`${API_URL}/search/nearest-sellers`, {
        params: { 
          latitude, 
          longitude, 
          page: pageNum,
          limit: 20 // Reduced page size for faster initial load
        }
      });
      
      const sellers = response.data.sellers;
      return { sellers, hasMore: sellers.length === 20 };
    } catch (err) {
      throw new Error(err.message);
    }
  }, [API_URL, user]);

  // Fetch favorites in parallel with sellers
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/favorites/all`, {
        params: { userId: user._id }
      });
      setFavorites(response.data.sellers.map(seller => seller._id));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, [API_URL, user]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isInitialLoad) return;

      dispatch(fetchSellersStart());
      try {
        // Fetch sellers and favorites in parallel
        const [sellersData] = await Promise.all([
          fetchSellers(1),
          fetchFavorites()
        ]);

        setNearSeller(sellersData.sellers);
        setHasMore(sellersData.hasMore);
        dispatch(fetchSellersSuccess(sellersData.sellers));
        setIsInitialLoad(false);
      } catch (err) {
        dispatch(fetchSellersFailure(err.message));
      }
    };

    loadInitialData();
  }, [dispatch, fetchSellers, fetchFavorites, isInitialLoad]);

  // Load more sellers
  const loadMoreSellers = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    try {
      const { sellers, hasMore: moreAvailable } = await fetchSellers(nextPage);
      setNearSeller(prev => [...prev, ...sellers]);
      setHasMore(moreAvailable);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more sellers:", error);
    }
  };

  // Optimized toggle favorite with local state update
  const toggleFavorite = async (sellerId, e) => {
    e.stopPropagation();
    if (!user) return;

    // Optimistic update
    setFavorites(prev => 
      prev.includes(sellerId)
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );

    try {
      const response = await axios.post(`${API_URL}/favorites/addorremove`, {
        sellerId,
        userId: user._id
      });

      if (!response.data.success) {
        // Revert on failure
        setFavorites(prev => 
          prev.includes(sellerId)
            ? prev.filter(id => id !== sellerId)
            : [...prev, sellerId]
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      setFavorites(prev => 
        prev.includes(sellerId)
          ? prev.filter(id => id !== sellerId)
          : [...prev, sellerId]
      );
    }
  };

  const handleClick = (seller) => {
    console.log("seller from ser card",seller);
    navigate(`/seller-profile/${seller._id}`, {
      state: { sellerData: seller },
    });
  };
 

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
    <div className=" bg-gray-100 ">
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {nearSeller.map((seller) => (
          <li
            key={seller._id}
            onClick={() => handleClick(seller)}
            className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] border border-gray-200 hover:border-gray-200"
          >
            <div className="absolute inset-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300" />

            <div className="relative z-10">
              {/* Favorite Heart Icon */}
              {user && (
                <button
                  onClick={(e) => toggleFavorite(seller._id, e)}
                  className="absolute top-3 right-3 z-20 hover:scale-110 transition-all duration-300"
                >
                  <Heart
                    size={24}
                    className={`
                      ${favorites.includes(seller._id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-white/80 hover:text-gray-200'}
                      transition-all duration-300
                    `}
                  />
                </button>
              )}

              {/* Image Container */}
              <div className="relative h-40 group-hover:brightness-[1.02] transition-all duration-300">
                <img
                  src={seller.profileImage}
                  alt={seller.companyName}
                  className="w-full h-full object-cover"
                />
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
                    <span className="truncate">{seller.place}</span>
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