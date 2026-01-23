import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage for persistence
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    return {
      seller: null,
      token: localStorage.getItem('authToken'),
    };
  }
  return {
    seller: null,
    token: null,
  };
};

const sellerSlice = createSlice({
  name: "seller",
  initialState: getInitialState(),
  reducers: {
    setSellerLogin: (state, action) => {
      state.seller = action.payload.seller;
      state.token = action.payload.token;
      
      // Store token in localStorage for development
      if (process.env.NODE_ENV === 'development' && action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
      }
    },
    setSellerLogout: (state) => {
      state.seller = null;
      state.token = null;
      
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    },
    updateSeller: (state, action) => {
      if (state.seller) {
        // Merge the existing seller data with the updated fields
        state.seller = { 
          ...state.seller, 
          ...action.payload 
        };
        console.log('Seller updated in Redux:', state.seller);
      }
    },
    updateSellerProfile: (state, action) => {
      if (state.seller) {
        state.seller = { 
          ...state.seller, 
          ...action.payload 
        };
        console.log('Seller profile updated in Redux');
      }
    },
    updateSellerPayment: (state, action) => {
      if (state.seller) {
        state.seller = {
          ...state.seller,
          ...action.payload,
          isPaymentSetup: true
        };
        console.log('Seller payment details updated in Redux');
      }
    },
    // Add more specific update actions if needed
    updateStoreName: (state, action) => {
      if (state.seller) {
        state.seller.storeName = action.payload;
      }
    },
    updateStoreDescription: (state, action) => {
      if (state.seller) {
        state.seller.description = action.payload;
      }
    },
    updateStoreContact: (state, action) => {
      if (state.seller) {
        state.seller = {
          ...state.seller,
          ...action.payload
        };
      }
    }
  },
});

export const { 
  setSellerLogin, 
  setSellerLogout, 
  updateSeller, 
  updateSellerProfile,
  updateSellerPayment,
  updateStoreName,
  updateStoreDescription,
  updateStoreContact
} = sellerSlice.actions;

export default sellerSlice.reducer;