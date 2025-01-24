import React, { useState } from "react";
import { Menu as MenuIcon, Package } from "lucide-react";
import LocationModal from "./LocationModel"; // Import the LocationModal component
import { useDispatch, useSelector } from "react-redux";
import AddSellerPage from "./CompanyDetails";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import ProfileDrawer from "./ProfileDrawer";

const NavComponent = ({ profileImage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const isSignedIn = !!user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLocationClick = () => {
    setIsModalOpen(true);
  };

  const handleLocationSelect = (location, address) => {
    console.log("Selected Location:", location);
    console.log("Address:", address);
    setSelectedLocation({ location, address });
    setIsModalOpen(false);
  };
  const handleLogout = (e) => {
    e.preventDefault();

    // Clear the token from localStorage if you're storing it there
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Dispatch logout action to clear Redux state
    dispatch(logout());

    // Redirect to login page
    navigate("/login");
  };

  return (
    <>
      <nav
        className="bg-gradient-to-b from-black via-[#119a6f] to-[#049b83]
SidebarComponent px-3 md:px-4 py-2 md:py-3 text-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Desktop and Mobile Layout */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-lg md:text-xl font-bold">
              <a
                href="/"
                className="text-white hover:text-[#87e8d5] transition-colors"
              >
                MyLogo
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="flex items-center space-x-2 hover:text-[#87e8d5] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <span>Home</span>
              </a>
              <button
                onClick={() => navigate("/category")}
                className="flex items-center space-x-2 hover:text-[#87e8d5] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 5h16v16H4V5zm0 8h16M12 5v16" />
                </svg>
                <span>Category</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-[#87e8d5] transition-colors">
                <Package size={20} />
                <span>Products</span>
              </button>
              <a
                href="/search"
                className="flex items-center space-x-2 hover:text-[#87e8d5] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span>Search</span>
              </a>
            </div>

            {/* Mobile Menu Button and Right Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-[#09735e] rounded-lg transition-colors"
              >
                <MenuIcon className="w-6 h-6" />
              </button>

              {/* Location Icon */}
              <button
                className="flex items-center justify-center w-8 h-8  rounded-lg hover:bg-[#09735e] transition-colors relative"
                onClick={handleLocationClick}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {selectedLocation && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Section */}
              <div className="relative">
                <button
                  onClick={toggleDrawer}
                  className="relative w-10 h-10 rounded-lg overflow-hidden group transition-all duration-300
                border border-emerald-400/20
                hover:border-emerald-400/40
                hover:shadow-[0_0_12px_rgba(135,232,213,0.2)]
                before:content-['']
                before:absolute
                before:inset-0
                before:bg-gradient-to-br
                before:from-emerald-500/10
                before:to-transparent
                before:opacity-0
                hover:before:opacity-100
                before:transition-opacity
                before:duration-300"
                >
                  {isSignedIn && profileImage ? (
                    <img
                      src={profileImage}
                      alt="../../public/Unknown_Member.jpg"
                      className="w-full h-full object-cover"
                    />
                  ) : isSignedIn && user?.name ? (
                    <div
                      className="w-full h-full flex items-center justify-center text-emerald-50 font-bold text-lg
                     bg-gradient-to-br from-[#049b83] to-[#036d5c]
                     uppercase tracking-wide"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src="../../public/Unknown_Member.jpg"
                      alt="Unknown Profile"
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </button>

                {/* Profile Dropdown */}
                {isSignedIn ? (
                  <ProfileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                  />
                ) : (
                  isDrawerOpen && (
                    <div className="absolute right-0 mt-2 z-10 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-700">
                      <a
                        href="/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Login
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 pt-2 border-t border-[#87e8d5]/20">
              <div className="flex flex-col space-y-2 text-sm">
                <a
                  href="/"
                  className="flex items-center space-x-2 p-2 hover:bg-[#09735e] rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  <span>Home</span>
                </a>
                <a
                  href="/category"
                  className="flex items-center space-x-2 p-2 hover:bg-[#09735e] rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 5h16v16H4V5zm0 8h16M12 5v16" />
                  </svg>
                  <span>Category</span>
                </a>
                <a
                  href="/search"
                  className="flex items-center space-x-2 p-2 hover:bg-[#09735e] rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <span>Search</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LocationModal
            onLocationSelect={handleLocationSelect}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default NavComponent;
