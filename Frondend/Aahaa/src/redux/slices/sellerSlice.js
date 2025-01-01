import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch seller details
export const fetchSellerDetails = createAsyncThunk(
  'seller/fetchSellerDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/sellers/seller/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching seller details');
    }
  }
);

// Slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    seller: null, // Store seller details
    loading: false, // Track loading state
    error: null, // Store error messages
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerDetails.fulfilled, (state, action) => {
        state.seller = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default sellerSlice.reducer;
