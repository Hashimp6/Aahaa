import { createSlice } from '@reduxjs/toolkit';

// Slice for categories
const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [], // Array to store the categories
  },
  reducers: {
    // Action to set categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    // Action to add a new category
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    // Action to remove a category by name
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category !== action.payload
      );
    },
  },
});

// Export actions
export const { setCategories, addCategory, removeCategory } = categorySlice.actions;

// Export reducer
export default categorySlice.reducer;
