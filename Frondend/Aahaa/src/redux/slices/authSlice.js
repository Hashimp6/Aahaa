import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // This will contain contact.address and location.coordinates
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUserDetails: (state, action) => {
      if (state.user) {
        const { address, coordinates } = action.payload;
        state.user.contact = {
          ...state.user.contact,
          address,
        };
        state.user.location = {
          ...state.user.location,
          coordinates,
        };
      }
    },
  },
});

export const { login, logout, updateUserDetails } = authSlice.actions;

export default authSlice.reducer;
