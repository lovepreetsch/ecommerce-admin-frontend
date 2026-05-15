import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/coupons');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/create',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/coupons', couponData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/update',
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/coupons/${id}`, couponData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/coupons/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
