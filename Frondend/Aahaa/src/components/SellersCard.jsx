// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setLoading,
//   setError,
//   addSellers,
// } from "../redux/slices/listOfSellers";
// import axios from "axios";

// // Custom hook to handle seller data fetching
// const useNearestSellers = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const { nearestSellers, loading, error } = useSelector(
//     (state) => state.listOfSellers
//   );
//   const [page, setPage] = useState(1);

//   const fetchNearestSellers = async () => {
//     // Return early if user or coordinates are not available
//     if (
//       !user?.location?.coordinates ||
//       user.location.coordinates.length !== 2
//     ) {
//       dispatch(setError("User location not available"));
//       return;
//     }

//     try {
//       dispatch(setLoading());
//       const [longitude, latitude] = user.location.coordinates;
//       console.log("details befor send", latitude, longitude, page);
//       const response = await axios.get("/api/search/nearest-sellers", {
//         params: {
//           latitude,
//           longitude,
//           page,
//         },
//       });

//       dispatch(
//         addSellers({
//           sellerType: "nearestSellers",
//           sellers: response.data.sellers,
//         })
//       );
//     } catch (err) {
//       dispatch(
//         setError(err.response?.data?.message || "Error fetching sellers")
//       );
//     }
//   };

//   const loadMore = () => {
//     setPage((prev) => prev + 1);
//   };

//   return {
//     sellers: nearestSellers,
//     loading,
//     error,
//     loadMore,
//     fetchNearestSellers,
//   };
// };

// const SellerList = () => {
//   const { sellers, loading, error, loadMore, fetchNearestSellers } =
//     useNearestSellers();
//   const user = useSelector((state) => state.auth.user);
//   const nearestSellers = useSelector(
//     (state) => state.listOfSellers.nearestSellers
//   );

//   useEffect(() => {
//     if (user?.location?.coordinates?.length === 2) {
//       fetchNearestSellers();
//     }
//   }, [user]);

//   // Handle error and loading states
//   if (!user?.location?.coordinates || user.location.coordinates.length !== 2) {
//     return (
//       <div className="text-red-500 text-center">
//         Location information not available
//       </div>
//     );
//   }

//   if (loading && sellers.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div
//       className="h-[95vh] overflow-y-auto grid grid-cols-2 sm:grid-cols-5 gap-4"
//       style={{
//         scrollbarWidth: "none",
//         msOverflowStyle: "none",
//       }}
//       onScroll={(e) => {
//         const { scrollTop, scrollHeight, clientHeight } = e.target;
//         if (scrollHeight - scrollTop <= clientHeight * 1.5) {
//           loadMore();
//         }
//       }}
//     >
//       {nearestSellers.map((seller, index) => (
//         <div
//           key={seller._id || index}
//           className="relative flex flex-col items-center rounded-lg p-4 group hover:bg-gray-300 transition-all duration-300"
//         >
//           {/* Profile Image */}
//           <div className="w-30 h-30 overflow-hidden">
//             <img
//               src={seller.profile}
//               alt={seller.companyName}
//               className="w-full h-full object-cover rounded-lg"
//             />
//           </div>

//           {/* Seller Info */}
//           <h3 className="mt-3 text-sm font-semibold text-gray-800">
//             {seller.companyName}
//           </h3>
//           <p className="text-xs text-gray-600">{seller.category}</p>

//           {/* Hover Button */}
//           <button className="absolute bottom-4 px-4 py-4 bg-green-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             Know More
//           </button>
//         </div>
//       ))}
//       {loading && sellers.length > 0 && (
//         <div className="text-center py-4">Loading more...</div>
//       )}
//     </div>
//   );
// };

// export default SellerList;
// src/components/SellerList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchSellersStart,
  fetchSellersSuccess,
  fetchSellersFailure,
} from "../redux/slices/listOfSellers";
import SellerProfile from "./SellerProfile";
import { useNavigate } from "react-router-dom";

const SellerList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { nearestSellers, loading, error } = useSelector(
    (state) => state.listOfSellers
  );

  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // To check if there are more sellers to load
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user location is available
    if (user?.location?.coordinates?.length === 2) {
      const [longitude, latitude] = user.location.coordinates;

      dispatch(fetchSellersStart());

      // Fetch sellers with pagination
      axios
        .get("/api/search/nearest-sellers", {
          params: { latitude, longitude, page },
        })
        .then((response) => {
          const sellers = response.data.sellers;
          dispatch(fetchSellersSuccess(sellers));
          console.log("sellers are ", sellers);

          // Check if there are more sellers to load
          if (sellers.length < 50) {
            setHasMore(false); // No more data to load
          }
        })
        .catch((err) => {
          dispatch(fetchSellersFailure(err.message));
        });
    }
  }, [user, page, dispatch]);

  const handleClick = (seller) => {
    navigate(`/seller-profile/${seller._id}`, { state: { sellerData: seller } });
  };

  const loadMoreSellers = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  if (!user?.location?.coordinates || user.location.coordinates.length !== 2) {
    return (
      <div className="text-red-500">Location information not available</div>
    );
  }

  if (loading) {
    return <div>Loading sellers...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <ul className=" grid grid-cols-1 md:grid-cols-2 p-2 lg:grid-cols-5 gap-4">
        {nearestSellers.map((seller) => (
          <li
            key={seller._id}
            className="relative flex flex-col items-center rounded-lg p-1 group hover:bg-gray-300 transition-all duration-300 border shadow-lg"
          >
            {/* Profile Image */}
            <div className="w-30 h-30 overflow-hidden">
              <img
                src={seller.profileImage} // Corrected to use profileImage field
                alt={seller.companyName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Seller Info */}
            <h3 className="mt-3 text-sm font-semibold text-gray-800">
              {seller.companyName}
            </h3>
            <p className="text-xs text-gray-600">{seller.category}</p>

            {/* Hover Button */}
            <button
              onClick={() => handleClick(seller)}
              className="absolute bottom-4 px-4 py-2 bg-green-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Know More
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={loadMoreSellers}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default SellerList;
