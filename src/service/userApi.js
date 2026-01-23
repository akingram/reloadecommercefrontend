import axios from "axios";

const API_URL = "https://multivendor-ecommerce-backend-xh7z.onrender.com/api";

// Create axios instance with credentials
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const createUser = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    return response.data;
  } catch (error) {
   console.error(error.message);
    throw error; 
  }
};

export const LoginUser = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const createrSeller = async (sellerData) => {
  try {
    const response = await api.post("/seller-signup", sellerData);
    return response.data;
  } catch (error) {
  console.error(error.message);
    throw error; 
  }
};

export const sellerLogin = async (sellerData) => {
  try {
    const response = await api.post("/seller-login", sellerData);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error; 
  }
};

export const postProduct = async () => {
  try {
    const response = await api.post(
      "https://multivendor-ecommerce-backend-xh7z.onrender.com/api/product-upload",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to posting product"
    );
  }
};

export const getSellerProducts = async (token, category = "") => {
  try {
    const response = await api.get("/seller", {
      headers: { Authorization: `Bearer ${token}` },
      params: category ? { category: category.toLowerCase() } : {},
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const updateProduct = async (token, productId, productData) => {
  try {
    const response = await api.patch(
      `/${productId}`,
      {
        ...productData,
        category: productData.category.toLowerCase(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

export const deleteProduct = async (token, productId) => {
  try {
    const response = await api.delete(`/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};


export const getAllProduct = async (category = '') => {
  try {
    const response = await api.get('/all', { params: { category } });
    console.log('getAllProduct response:', response.data); // Debug log
    // Normalize category in response
    const data = Array.isArray(response.data)
      ? response.data.map((p) => ({
        ...p,
        category: p.category.toLowerCase() === 'clothes' ? 'clothing' : p.category.toLowerCase(),
      }))
      : response.data.products
        ? response.data.products.map((p) => ({
          ...p,
          category: p.category.toLowerCase() === 'clothes' ? 'clothing' : p.category.toLowerCase(),
        }))
        : [];
    return data;
  } catch (error) {
    console.error('getAllProduct error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getShopByCategory = async (category) => {
  try {
    // Normalize category for API call
    const normalizedCategory = category.toLowerCase().replace(/ & /g, '-').replace('clothes', 'clothing');
    const response = await api.get('/shop-by-category', {
      params: { category: normalizedCategory },
    });
    console.log('getShopByCategory response:', response.data); // Debug log
    // Normalize category in response
    const data = Array.isArray(response.data)
      ? response.data.map((p) => ({
        ...p,
        category: p.category.toLowerCase() === 'clothes' ? 'clothing' : p.category.toLowerCase(),
      }))
      : response.data.products
        ? response.data.products.map((p) => ({
          ...p,
          category: p.category.toLowerCase() === 'clothes' ? 'clothing' : p.category.toLowerCase(),
        }))
        : [];
    return data;
  } catch (error) {
    console.error('getShopByCategory error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch category products');
  }
};

export const getTrendingThisWeek = async () => {
  try {
    const response = await api.get("/trending");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch trending products"
    );
  }
};

export const getWhatsHotThisWeek = async () => {
  try {
    const response = await api.get("/hot");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch hot products"
    );
  }
};

export const getFeaturedCollections = async () => {
  try {
    const response = await api.get("/featured");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch featured collections"
    );
  }
};



export const getStyleInspiration = async () => {
  try {
    const response = await api.get("/style-inspiration");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch style inspiration"
    );
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    console.log('getProductById response:', response.data);
    const product = response.data;
    return {
      ...product,
      category: product.category.toLowerCase() === 'clothes' ? 'clothing' : product.category.toLowerCase().replace(/ & /g, '-'),
    };
  } catch (error) {
    console.error('getProductById error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch product details');
  }
};




export const addCart = async (productId, quantity, sessionId) => {
  try {
    const response = await api.post('/add', { productId, quantity, sessionId: sessionId || null });
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
