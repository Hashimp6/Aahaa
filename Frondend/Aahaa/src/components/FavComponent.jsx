import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Store, MapPin, Star, Heart } from "lucide-react";

function FavComponent() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/favorites/all`, {
          params: { userId: user?._id },
        });
        setFavorites(response.data.sellers || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleClick = (seller) => {
    navigate(`/seller-profile/${seller._id}`, {
      state: { sellerData: seller },
    });
  };

  const toggleFavorite = async (sellerId, e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(`${API_URL}/favorites/addorremove`, {
        sellerId,
        userId: user._id,
      });

      if (response.data.success) {
        // Remove the seller from the favorites list
        setFavorites((prev) =>
          prev.filter((seller) => seller._id !== sellerId)
        );
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="bg-white text-gray-600 px-6 py-4 rounded-lg shadow-sm">
          Loading favorites...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="w-full min-h-[60vh] bg-gradient-to-br from-white to-gray-50 rounded-xl flex justify-center items-center p-8">
        <div className="text-center space-y-3">
          <Store size={48} className="mx-auto text-gray-400" />
          <p className="text-xl font-medium text-gray-600">No favorites yet</p>
          <p className="text-gray-500">
            Browse sellers and add them to your favorites
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-3">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Favorite Sellers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {favorites.map((seller) => (
            <div
              key={seller._id}
              onClick={() => handleClick(seller)}
              className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] border border-gray-200 hover:border-gray-300 cursor-pointer"
            >
              <div className="absolute inset-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300" />

              <div className="relative z-10">
                {/* Favorite Heart Icon */}
                <button
                  onClick={(e) => toggleFavorite(seller._id, e)}
                  className="absolute top-3 right-3 z-20 hover:scale-110 transition-all duration-300"
                >
                  <Heart
                    size={24}
                    className="fill-red-500 text-red-500 transition-all duration-300"
                  />
                </button>

                {/* Image Container */}
                <div className="relative h-40 group-hover:brightness-[1.02] transition-all duration-300">
                  <img
                    src={seller.profileImage || "/Unknown_Member.jpg"}
                    alt={seller.companyName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="pl-2 p-1 space-y-2 bg-white group-hover:bg-gray-50/50 transition-colors duration-300">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavComponent;
