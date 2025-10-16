import api from "./axios";

// =============================
// 🛍 FETCH ALL PRODUCTS
// =============================
export const fetchProducts = async () => {
  try {
    const response = await api.get("/product/"); // 
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// =============================
// 🔍 SEARCH PRODUCTS
// =============================
export const searchProducts = async (query) => {
  try {
    const response = await api.get("/products/search", { params: { query } }); // ✅ plural
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// =============================
// 💰 FETCH PRODUCTS BY PRICE RANGE
// =============================
export const fetchProductsByRange = async (min, max) => {
  try {
    const response = await api.get("/product/range", { params: { min, max } }); // ✅ plural
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// =============================
// ⚙️ ADMIN — ADD PRODUCT
// =============================
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/product/add", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// =============================
// ✏️ ADMIN — UPDATE PRODUCT
// =============================
export const updateProductById = async (productId, updateData) => {
  try {
    const response = await api.put(`/product/update/${productId}`, updateData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
