import { http } from "./http";

export const getWishlist = async () => {
  try {
    const response = await http.get("/wishlist");
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist", error);
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await http.post("/wishlist/add", { productId });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await http.delete(`/wishlist/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist", error);
    throw error;
  }
};

export const checkProductInWishlist = async (productId) => {
  try {
    const response = await http.get(`/wishlist/check/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking wishlist", error);
    throw error;
  }
};

export const moveToCart = async (productId) => {
  try {
    const response = await http.post("/wishlist/move-to-cart", { productId });
    return response.data;
  } catch (error) {
    console.error("Error moving to cart", error);
    throw error;
  }
};

export const clearWishlist = async () => {
  try {
    const response = await http.delete("/wishlist/clear");
    return response.data;
  } catch (error) {
    console.error("Error clearing wishlist", error);
    throw error;
  }
};
