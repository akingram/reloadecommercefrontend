import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage for persistence
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    return {
      user: null,
      token: localStorage.getItem('authToken'),
    };
  }
  return {
    user: null,
    token: null,
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    setUserLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Store token in localStorage for development
      if (process.env.NODE_ENV === 'development' && action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
      }
    },
    setUserLogout: (state) => {
      state.user = null;
      state.token = null;
      
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUserLogin, setUserLogout, updateUser } = userSlice.actions;
export default userSlice.reducer;