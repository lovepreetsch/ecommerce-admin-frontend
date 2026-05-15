import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAll',
  async ({ page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/products/reviews/admin/all?page=${page}&size=${size}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  'reviews/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/products/reviews/admin/${id}/status?status=${status}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/products/reviews/admin/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    loading: false,
    error: null,
    totalPages: 0,
    totalElements: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;
