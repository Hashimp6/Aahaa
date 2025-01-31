import React, { useState, useEffect } from 'react';
import { Store, MapPin, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SearchResults = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      handleSearch();
    } else {
      setSellers([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get location coordinates
      let latitude, longitude;

      if (user?.location?.coordinates?.length === 2) {
        // Extract coordinates from user object
        [longitude, latitude] = user.location.coordinates;
      } else {
        // Retrieve location from localStorage
        const userLoc = localStorage.getItem("userLocation");

        if (userLoc) {
          const parsedLocation = JSON.parse(userLoc);
          latitude = parsedLocation.lat;
          longitude = parsedLocation.lng;
        } else {
          // Fallback default coordinates
          latitude = 0;
          longitude = 0;
        }
      }

      // Make API request with all required parameters
      const response = await axios.get(`${API_URL}/search/search-sellers`, {
        params: {
          searchTerm,
          latitude,
          longitude
        }
      });

      // Handle the matchType from backend
      setSellers(response.data.sellers);
      
    } catch (err) {
      setError("Failed to fetch results");
      setSellers([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClick = (seller) => {
    navigate(`/seller-profile/${seller._id}`, {
      state: { sellerData: seller },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-start">
      <div className="bg-gradient-to-b from-white to-gray-50 w-full h-full md:h-[90vh] mt-8 rounded-t-2xl flex flex-col shadow-2xl">
        {/* Search Header */}
        <div className="p-6 border-b border-teal-100 flex items-center gap-4 bg-gradient-to-r from-teal-50 to-white rounded-t-2xl">
          <div className="flex items-center flex-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-teal-100">
            <Search className="text-teal-500" size={20} />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 ml-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              autoFocus
            />
          </div>
          <button 
            onClick={onClose}
            className="bg-white p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-teal-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="w-full min-h-[60vh] flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-500"></div>
            </div>
          )}

          {error && (
            <div className="w-full min-h-[60vh] bg-red-50 rounded-2xl flex justify-center items-center">
              <p className="text-red-600 flex items-center gap-2">
                <X size={20} className="text-red-500" />
                {error}
              </p>
            </div>
          )}

          {!isLoading && !error && sellers.length === 0 && searchTerm.length >= 2 && (
            <div className="w-full min-h-[60vh] bg-gradient-to-br from-teal-50 to-white rounded-2xl flex justify-center items-center p-8">
              <div className="text-center space-y-4">
                <Store size={48} className="mx-auto text-teal-400" />
                <p className="text-xl font-medium text-gray-600">
                  No sellers found
                </p>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller._id}
                onClick={() => handleClick(seller)}
                className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-md border border-teal-50"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={seller.profileImage || "../../public/Unknown_Member.jpg"}
                    alt={seller.companyName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3 bg-white">
                  <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-teal-600 transition-colors duration-300">
                    {seller.companyName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Store
                        size={16}
                        className="text-teal-500 group-hover:text-teal-600 transition-colors duration-300"
                      />
                      <span className="truncate">
                        {seller.category || "Uncategorized"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin
                        size={16}
                        className="text-teal-500 group-hover:text-teal-600 transition-colors duration-300"
                      />
                      <span className="truncate">{seller.place}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;