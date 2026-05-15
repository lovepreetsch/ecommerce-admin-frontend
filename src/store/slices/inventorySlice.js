import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchAllInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/inventory');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ productId, quantity, warehouseLocation }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/inventory/${productId}?quantity=${quantity}&warehouseLocation=${warehouseLocation || ''}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.productId === action.payload.productId);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default inventorySlice.reducer;
