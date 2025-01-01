// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Import the authSlice
import sellerReducer from "./slices/sellerSlice";
import categorySlice from "./slices/categorySlice";
import listOfSellersReducer from './slices/listOfSellers';

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your slices to the store here
    seller: sellerReducer,
    category: categorySlice,
    listOfSellers: listOfSellersReducer,
  },
});

export default store;
