import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orders = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Add a new order
    addOrder: (state, action) => {
      state.orders.unshift(action.payload); // Add new order at beginning of array
      state.currentOrder = action.payload; // Set as current order
    },
    
    // Set all orders (useful when fetching from backend)
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    
    // Set current order details
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    
    // Update order status
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
      }
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.status = status;
      }
    },
    
    // Loading state for async operations
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear current order (after confirmation page)
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // Clear all orders (for logout)
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
    }
  },
});

export const { 
  addOrder, 
  setOrders, 
  setCurrentOrder, 
  updateOrderStatus, 
  setLoading, 
  setError,
  clearCurrentOrder,
  clearOrders
} = orders.actions;

export default orders.reducer;