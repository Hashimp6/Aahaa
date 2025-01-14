import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import NavComponent from "../components/Nav";
import SellerList from "../components/SellersCard";
import SidebarComponent from "../components/SideOptions";
import LocationSelector from "../components/LocationModel";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);
  
  // Only check location on first login
  const shouldShowLocationSelector = () => {
    // Check if user has never set location before
    const hasNeverSetLocation = !localStorage.getItem("locationSet");
    
    // Check if coordinates are invalid
    const hasInvalidCoordinates = 
      !user?.location?.coordinates ||
      (user.location.coordinates[0] === 0 && user.location.coordinates[1] === 0);
    
    return hasNeverSetLocation && hasInvalidCoordinates;
  };

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

  // Show loading state while checking user auth
  if (!user) {
    return (
      <div className="fixed w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  // Only show location selector if user has never set location
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
    <div className="fixed w-full">
      <NavComponent />
      <div className="flex">
        <SidebarComponent />
        <div className="w-full p-2 overflow-y-auto">
          <SellerList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;