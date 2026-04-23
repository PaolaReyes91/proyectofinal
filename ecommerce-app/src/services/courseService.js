import { http } from "./http";

export const fetchCourses = async () => {
  try {
    const response = await http.get("/products");
    const data = response.data;
    // El backend devuelve { products: [...] }
    return data?.products || data?.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const searchCourses = async (query) => {
  try {
    const response = await http.get(`/products/search?q=${encodeURIComponent(query)}`);
    const data = response.data;
    return data?.products || data?.data || [];
  } catch (error) {
    console.error("Error searching courses:", error);
    return [];
  }
};

export const getCoursesByCategory = async (categoryId) => {
  try {
    const response = await http.get(`/products/category/${categoryId}`);
    const data = response.data;
    return data?.products || data?.data || [];
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
};

export async function getCourseById(id) {
  try {
    const response = await http.get(`/products/${id}`);
    // getProductById devuelve el producto directamente
    return response.data;
  } catch (error) {
    console.error("Error fetching course by id:", error);
    return null;
  }
}