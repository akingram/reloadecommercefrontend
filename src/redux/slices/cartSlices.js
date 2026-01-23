// redux/slices/cartSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { syncCart } from '../../service/cartApi';
import { getSessionId } from '../../service/cartApi';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const items = localStorage.getItem('cartItems');
    const sessionId = localStorage.getItem('cartSessionId'); // Consistent key
    return {
      items: items ? JSON.parse(items) : [],
      sessionId: sessionId || null,
      status: 'idle',
      error: null,
      lastSynced: null,
    };
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return { items: [], sessionId: null, status: 'idle', error: null, lastSynced: null };
  }
};

// Save cart to localStorage
const saveCartToStorage = (items, sessionId) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
    if (sessionId) {
      localStorage.setItem('cartSessionId', sessionId);
    }
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

const initialState = loadCartFromStorage();

// Async thunk to sync cart to backend
export const syncCartToBackend = createAsyncThunk(
  'cart/syncToBackend',
  async (_, { getState, rejectWithValue }) => {
    const { cart } = getState();
    
    // Don't sync empty carts
    if (cart.items.length === 0) {
      return rejectWithValue('Empty cart');
    }

    // Format items for backend
    const backendItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      // Use current sessionId or generate a new one
      const sessionId = cart.sessionId || getSessionId();
      const response = await syncCart(backendItems, sessionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set entire cart (useful after login)
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.sessionId = action.payload.sessionId || state.sessionId;
      saveCartToStorage(state.items, state.sessionId);
      state.status = 'succeeded';
      state.error = null;
    },

    // Add item to cart
    addItem: (state, action) => {
      const { productId, quantity = 1, ...rest } = action.payload;
      if (!productId) return;

      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ productId, quantity, ...rest });
      }
      saveCartToStorage(state.items, state.sessionId);
      state.lastSynced = null; // Mark as needing sync
    },

    // Update item quantity
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (!productId || quantity < 1) return;

      const itemIndex = state.items.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        state.items[itemIndex].quantity = quantity;
        if (state.items[itemIndex].quantity === 0) {
          state.items.splice(itemIndex, 1);
        }
        saveCartToStorage(state.items, state.sessionId);
        state.lastSynced = null; // Mark as needing sync
      }
    },

    // Remove item from cart
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      saveCartToStorage(state.items, state.sessionId);
      state.lastSynced = null; // Mark as needing sync
    },

    // Set session ID
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
      saveCartToStorage(state.items, state.sessionId);
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.sessionId = null;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartSessionId');
      state.status = 'idle';
      state.error = null;
      state.lastSynced = Date.now();
    },

    // Set cart status manually
    setCartStatus: (state, action) => {
      state.status = action.payload.status;
      state.error = action.payload.error || null;
    },

    // Decrease item quantity
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.items.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
        saveCartToStorage(state.items, state.sessionId);
        state.lastSynced = null; // Mark as needing sync
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(syncCartToBackend.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(syncCartToBackend.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.cart) {
          // Transform backend cart data to frontend format
          state.items = action.payload.cart.items.map((item) => ({
            productId: item.productId._id, // Extract ID from populated object
            quantity: item.quantity,
            price: item.price,
            name: item.productId.title || 'Untitled Product',
            image: item.productId.images?.[0] || 'https://via.placeholder.com/150',
            seller: item.productId.seller?.storeName || 'Unknown Seller',
          }));
          
          // Save updated cart and session ID
          saveCartToStorage(state.items, action.payload.sessionId || state.sessionId);
          if (action.payload.sessionId) {
            state.sessionId = action.payload.sessionId;
          }
          
          // Mark as synced
          state.lastSynced = Date.now();
        }
      })
      .addCase(syncCartToBackend.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setCart,
  addItem,
  updateItemQuantity,
  removeItem,
  setSessionId,
  clearCart,
  setCartStatus,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;