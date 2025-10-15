import api from "./axios";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await api.get("/product/");
    return response.data;
  }
    catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
    } 
};

// Search products by title or description
export const searchProducts = async (query) => {
  try {
    const response = await api.get("/product/search", { params: { query } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// Fetch products within a price range
export const fetchProductsByRange = async (min, max) => {
  try {
    const response = await api.get("/product/range", { params: { min, max } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};


// Admin

// add product
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/product/add", productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Update product by name
export const updateProductByName = async (productId, updateData) => {
  try {
    const response = await api.put(`/product/update/${productId}`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};