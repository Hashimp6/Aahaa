import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import NavComponent from "../components/Nav";
import CategoryList from "../components/LeftCategory";
import SellerList from "../components/SellersCard";
import SidebarComponent from "../components/SideOptions";
import LocationSelector from "../components/LocationModel";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Check if user has valid location coordinates
  const hasValidLocation =
    user?.location?.coordinates &&
    (user.location.coordinates[0] !== 0 || user.location.coordinates[1] !== 0);

  useEffect(() => {
    // Check if the user already exists in Redux
    if (user) {
      return;
    }

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(login({ user: parsedUser, token }));
    } else {
      navigate("/login");
    }
  }, [user, dispatch, navigate]);

  // Show loading state while checking user auth
  if (!user) {
    return (
      <div className="fixed w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  // If user doesn't have valid location, show LocationSelector
  if (!hasValidLocation) {
    return (
      <div className="fixed w-full">
        <NavComponent />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LocationSelector />
        </div>
      </div>
    );
  }

  // Main content when user has valid location
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
