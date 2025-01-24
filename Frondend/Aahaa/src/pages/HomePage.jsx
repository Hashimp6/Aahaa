import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import NavComponent from "../components/Nav";
import SellerList from "../components/SellersCard";
import SidebarComponent from "../components/SideOptions";
import LocationSelector from "../components/LocationModel";
import axios from "axios";
import { setSellerData } from "../redux/slices/sellerSlice";

function HomePage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);
  const sellerData = useSelector((state) => state.seller.sellerData);

  // Only check location on first login
  const shouldShowLocationSelector = () => {
    const hasNeverSetLocation = !localStorage.getItem("locationSet");
    const hasInvalidCoordinates =
      !user?.location?.coordinates ||
      (user.location.coordinates[0] === 0 && user.location.coordinates[1] === 0);

    return hasNeverSetLocation && hasInvalidCoordinates;
  };

  // Authentication and initial data loading
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(login({ user: parsedUser, token }));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // Seller data fetching (only if not already loaded)
  useEffect(() => {
    const fetchSellerData = async () => {
      // Only fetch if seller data doesn't exist and user has seller details
      if (!sellerData && user?.sellerDetails) {
        try {
          setLoading(true);
          const sellerId = user.sellerDetails;
          const response = await axios.get(
            `${API_URL}/sellers/seller/${sellerId}`
          );

          if (response.data) {
            dispatch(setSellerData(response.data));
          } else {
            throw new Error("Invalid response data structure");
          }
        } catch (error) {
          console.error("Error fetching seller data:", error.response || error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [dispatch, user, sellerData, API_URL]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  // No user redirect
  if (!user) {
    navigate("/login");
    return null;
  }

  // Location selector
  if (shouldShowLocationSelector()) {
    return (
      <div className="fixed w-full">
        <NavComponent />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LocationSelector />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="fixed w-full h-screen flex flex-col">
      <NavComponent />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent />
        <div className="w-full p-2 z-0 overflow-y-auto pb-16 md:pb-2">
          <SellerList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;