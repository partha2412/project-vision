import api from "./axios";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await api.get("/product/");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
// Fetch product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Search products by title or description
export const searchProducts = async (order) => {
  try {
    const response = await api.get("/product/search", { params: { order } });
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

// Add product
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

// Add Bulk
export const addBulk = async (formData) => {
  try {
    const response = await api.post(
      "/product/add_bulk",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response);
    
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Update product by ID
export const updateProductById = async (productId, updateData) => {
  try {
    //console.log(updateData);

    const response = await api.put(`/product/update/${productId}`, updateData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Sort products by price
export const fetchSortedProducts = async (order) => {
  try {
    // Make GET request with order param
    const response = await api.get("/product/sort", { params: { order } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Hard delete product
export const hardDeleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/product/delete/hard/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// ✅ Fetch products by category
export const fetchProductsByCategory = async (category) => {
  try {
    const endpoint =
      category.toLowerCase() === "all"
        ? "/product/all"
        : `/product/category/${category}`;
    const response = await api.get(endpoint);
    return response.data; // backend returns { products: [...] }
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};