import { http } from "./http";

export const fetchCategories = async () => {
  try {
    const response = await http.get("/categories");
    const data = response.data;
    return data?.categories || data?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const response = await http.get("/products");
    const data = response.data;
    return data?.products || data?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const searchCategories = async (query) => {
  try {
    const response = await http.get(`/categories/search?q=${encodeURIComponent(query)}`);
    const data = response.data;
    return data?.categories || data?.data || [];
  } catch (error) {
    console.error("Error searching categories:", error);
    return [];
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await http.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

export const getChildCategories = async (parentCategoryId) => {
  try {
    const response = await http.get(`/categories?parentCategory=${parentCategoryId}`);
    const data = response.data;
    return data?.categories || data?.data || [];
  } catch (error) {
    console.error("Error fetching child categories:", error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await http.get(`/products/category/${categoryId}`);
    const data = response.data;
    return data?.products || data?.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const getProductsByCategoryAndChildren = async (categoryId) => {
  try {
    const response = await http.get(`/products/category/${categoryId}`);
    const data = response.data;
    return data?.products || data?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getParentCategories = async () => {
  try {
    const response = await http.get("/categories");
    const data = response.data;
    const categories = data?.categories || data?.data || [];
    return categories.filter((cat) => !cat.parentCategory);
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    return [];
  }
};