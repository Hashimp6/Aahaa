import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSellerData } from "../redux/slices/sellerSlice";
import LeftSideComponent from "../components/ProfileLeft";
import RightSideComponent from "../components/ProfileRight";

const Profile = () => {
  const API_URL = process.env.REACT_APP_API_URL; 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      // Reset states at the start of fetch
      setLoading(true);
      setError(null);

      if (!user?.sellerDetails) {
        console.log("No seller details found in user object:", user);
        setLoading(false);
        return;
      }

      try {
     
        const sellerId=user.sellerDetails
        console.log("seller detalils ",sellerId);
        const response = await axios.get(
          `${API_URL}/sellers/seller/${sellerId}`
        );

        // Log the response data before dispatching
        console.log("API Response:", response.data);

        // Verify the response data has the expected structure
        if (response.data) {
          dispatch(setSellerData(response.data));
          console.log("Successfully dispatched seller data to Redux");
        } else {
          throw new Error("Invalid response data structure");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error.response || error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [dispatch, user]);

  // Add a selector to verify the data is in Redux store
  const sellerData = useSelector((state) => state.seller.sellerData);
  useEffect(() => {
    console.log("Current seller data in Redux:", sellerData);
  }, [sellerData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex  bg-gray-100">
      {/* Left Side - Fixed */}
      <div className=" border-r border-gray-300 bg-white">
        <LeftSideComponent />
      </div>

      {/* Right Side - Scrollable */}
      <div className="w-3/4 overflow-y-auto scrollbar-hide">
        <RightSideComponent />
      </div>
    </div>
  );
};

export default Profile;
