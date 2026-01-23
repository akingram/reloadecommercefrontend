import { api } from './cartApi';

// Get seller dashboard stats
export const getSellerStats = async () => {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get seller stats');
    }
};

// Get seller orders
export const getSellerOrders = async (params = {}) => {
    try {
        const response = await api.get('/orders', { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get seller orders');
    }
};

// Get specific order details
export const getSellerOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get order details');
    }
};

// Update seller profile
export const updateSellerProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
};

// Get top selling products
export const getTopSellingProducts = async () => {
    try {
        const response = await api.get('/products/top-selling');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get top selling products');
    }
};

// Get list of banks
export const getBanks = async () => {
    try {
        const response = await api.get('/banks');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get banks list');
    }
};


// Verify bank account with Paystack
export const verifyBankAccount = async (accountNumber, bankCode) => {
  try {
    const response = await api.post('/verify-account', {
      accountNumber,
      bankCode
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify account');
  }
};


export const resolveBankFromAccount = async (accountNumber) => {
  try {
    const response = await api.post('/resolve-bank-account', {
      accountNumber
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resolve bank from account number');
  }
};


// Add to service/sellerApi.js
export const setupSellerPayment = async (paymentData) => {
    try {
        const response = await api.post('/payment/setup', paymentData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to setup payment');
    }
};

