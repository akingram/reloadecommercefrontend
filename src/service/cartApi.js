// service/cartApi.js
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const API_URL = "https://reloadecommercebackend.onrender.com/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get authentication token from storage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('authToken');
      if (tokenFromStorage) {
        return tokenFromStorage;
      }
    }
    return null;

};

// Add token to all requests automatically (for development)
api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set with token for URL:', config.url);
  } else {
    console.log('No token in header, using httpOnly cookies for:', config.url);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Authentication error, clearing tokens');
      // Clear tokens from localStorage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // You might want to dispatch a logout action here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// Generate or retrieve session ID for guest users
export const getSessionId = () => {
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
};

// Clear session ID (useful after login)
export const clearSessionId = () => {
  localStorage.removeItem('cartSessionId');
};

// API functions
export const addCart = async (productId, quantity, sessionId) => {
  try {
    const response = await api.post('/add', { productId, quantity, sessionId });
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add to cart');
  }
};

export const updateCart = async (productId, quantity, sessionId) => {
  try {
    const response = await api.put('/update', { productId, quantity, sessionId });
    return response.data;
  } catch (error) {
    console.error('Update cart error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update cart');
  }
};

export const deleteCartItem = async (productId, sessionId) => {
  try {
    const response = await api.delete(`/remove/${productId}`, {
      params: { sessionId },
    });
    return response.data;
  } catch (error) {
    console.error('Delete cart item error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
  }
};

export const getCart = async (sessionId) => {
  try {
    const response = await api.get('/cart', { params: { sessionId } });
    return response.data;
  } catch (error) {
    console.error('Get cart error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

// Sync local cart to backend (critical for guest checkout)
export const syncCart = async (items, sessionId) => {
  try {
    const response = await api.post('/sync', { items, sessionId });
    return response.data;
  } catch (error) {
    console.error('Sync cart error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to sync cart');
  }
};

// Create order from synced cart
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/create-order', orderData);
    return response.data;
  } catch (error) {
    console.error('Create order error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

// service/cartApi.js
export const verifyPayment = async (reference, orderId) => {
  try {
    const response = await api.get(
      `/verify-payment-handler?reference=${encodeURIComponent(reference)}&orderId=${encodeURIComponent(orderId)}`
    )
    return response.data;
  } catch (error) {
    console.error('Verify payment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

// Get user's orders
export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Get orders error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get orders');
  }
};

// Get specific order details
export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Get order details error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get order details');
  }
};

// Confirm order delivery
export const confirmOrderDelivery = async (orderId) => {
  try {
    const response = await api.post(`/${orderId}/confirm-delivery`);
    return response.data;
  } catch (error) {
    console.error('Confirm delivery error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to confirm delivery');
  }
};