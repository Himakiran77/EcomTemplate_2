import { createSlice } from '@reduxjs/toolkit';

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const initialState = {
  items: [],
  total: 0,
  buyNowItem: null,
  isBuyNowFlow: false, 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: action.payload.quantity || 1 
        });
      }
      state.total = calculateTotal(state.items);
      state.isBuyNowFlow = false; 
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      if (state.buyNowItem?.id === action.payload) {
        state.buyNowItem = null;
        state.isBuyNowFlow = false;
      }
    },
    
    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.total = calculateTotal(state.items);
      }
    },
    
    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.total = calculateTotal(state.items);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.buyNowItem = null;
      state.isBuyNowFlow = false;
    },
    
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
      }
    },
    
    setBuyNowItem: (state, action) => {
      state.buyNowItem = action.payload;
      state.isBuyNowFlow = true;
      // Optionally clear cart items for pure Buy Now flow
      // state.items = [];
      // state.total = 0;
    },
    
    clearBuyNow: (state) => {
      state.buyNowItem = null;
      state.isBuyNowFlow = false;
    },
    
    // Optional: merge Buy Now item into regular cart
    mergeBuyNowToCart: (state) => {
      if (state.buyNowItem) {
        const existingItem = state.items.find(item => item.id === state.buyNowItem.id);
        if (existingItem) {
          existingItem.quantity += state.buyNowItem.quantity || 1;
        } else {
          state.items.push(state.buyNowItem);
        }
        state.total = calculateTotal(state.items);
        state.buyNowItem = null;
        state.isBuyNowFlow = false;
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart,
  updateCartItem,
  setBuyNowItem,
  clearBuyNow,
  mergeBuyNowToCart
} = cartSlice.actions;

export default cartSlice.reducer;