import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import axios from "axios";
import { setSellerData } from "../redux/slices/sellerSlice";

// Lazy load components
const NavComponent = React.lazy(() => import("../components/Nav"));
const SidebarComponent = React.lazy(() => import("../components/SideOptions"));
const LocationSelector = React.lazy(() => import("../components/LocationModel"));
const SellerList = React.lazy(() => import("../components/SellersCard"));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="fixed w-full h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
  </div>
);

function HomePage() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized selectors
  const user = useSelector((state) => state.auth.user);
  const sellerData = useSelector((state) => state.seller.sellerData);

  // Memoized location check
  const shouldShowLocationSelector = useCallback(() => {
    const hasNeverSetLocation = !localStorage.getItem("locationSet");
    const storedLocation = localStorage.getItem("userLocation");
    
    const hasInvalidCoordinates = 
      !user?.location?.coordinates ||
      (user.location.coordinates[0] === 0 && user.location.coordinates[1] === 0);
    
    const hasStoredLocation = storedLocation && storedLocation !== "null";
    
    return hasNeverSetLocation && hasInvalidCoordinates && !hasStoredLocation;
  }, [user?.location?.coordinates]);

  // Authentication check with AbortController
  useEffect(() => {
    const controller = new AbortController();

    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          dispatch(login({ user: parsedUser, token }));
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => controller.abort();
  }, [dispatch]);

  // Optimized seller data fetching
  useEffect(() => {
    const controller = new AbortController();

    const fetchSellerData = async () => {
      if (!sellerData && user?.sellerDetails) {
        try {
          setLoading(true);
          const sellerId = user.sellerDetails;
          
          const response = await axios.get(
            `${API_URL}/sellers/seller/${sellerId}`,
            { signal: controller.signal }
          );

          if (response.data) {
            dispatch(setSellerData(response.data));
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Error fetching seller data:", error);
            setError(error.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSellerData();

    return () => controller.abort();
  }, [dispatch, user, sellerData, API_URL]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (shouldShowLocationSelector()) {
    return (
      <div className="fixed w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <NavComponent />
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <LocationSelector />
          </div>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="fixed w-full h-screen flex flex-col">
      <Suspense fallback={<LoadingSpinner />}>
        <NavComponent />
        <div className="flex flex-1 overflow-hidden">
          <SidebarComponent />
          <div className="w-full p-2 z-0 overflow-y-auto pb-16 md:pb-2">
            <SellerList />
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default React.memo(HomePage);