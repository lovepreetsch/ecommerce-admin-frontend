import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import inventoryReducer from './slices/inventorySlice';
import couponReducer from './slices/couponSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    users: userReducer,
    inventory: inventoryReducer,
    coupons: couponReducer,
    reviews: reviewReducer,
  },
});
