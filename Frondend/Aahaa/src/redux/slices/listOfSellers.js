// src/redux/listOfSellersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nearestSellers: [],
  loading: false,
  error: null,
};

const listOfSellersSlice = createSlice({
  name: 'listOfSellers',
  initialState,
  reducers: {
    fetchSellersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSellersSuccess: (state, action) => {
      state.loading = false;
      
      // Avoid duplicates: add new sellers only if they don't already exist
      const newSellers = action.payload;
      const existingSellerIds = new Set(state.nearestSellers.map(seller => seller._id));

      const sellersToAdd = newSellers.filter(
        (newSeller) => !existingSellerIds.has(newSeller._id)
      );

      state.nearestSellers = [...state.nearestSellers, ...sellersToAdd];
    },
    fetchSellersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchSellersStart, fetchSellersSuccess, fetchSellersFailure } = listOfSellersSlice.actions;
export default listOfSellersSlice.reducer;
