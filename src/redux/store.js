import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlistSlice'
import cartReducer from './cartSlice'
import ordersReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: ordersReducer
  },
});