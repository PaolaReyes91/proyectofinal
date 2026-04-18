import { http } from "./http";

export const getCart = async (userId) => {
  if (!userId) return null; 
  // URL: /api/cart/user/:userId -> COINCIDE con backend
  const response = await http.get(`/cart/user/${userId}`); 
  return response.data;
};

export const addToCart = async (userId, productId, quantity) => {
  console.log("Enviando al backend:", { userId, productId, quantity });
  // URL: /api/cart/add-product -> COINCIDE con backend
  const response = await http.post("/cart/add-product", {
    userId,
    productId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (userId, productId, quantity) => {
  try {
    // URL: /api/cart/update-item -> Verifica que coincida con tu backend
    const response = await http.put("/cart/update-item", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar carrito:", error.response?.data || error.message);
    throw error;
  }
};

export const removeToCart = async (userId, productId) => {
  try {
    /** * CORRECCIÓN: Agregué la "/" inicial antes de 'cart'. 
     * Sin ella, Axios podría intentar concatenar mal la URL.
     */
    const response = await http.delete(`/cart/remove-item/${productId}`, {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar item:", error.response?.data || error.message);
    throw error;
  }
};

export const clearCart = async (userId) => {
  try {
    /** * CORRECCIÓN: Agregué la "/" inicial antes de 'cart'.
     */
    const response = await http.post("/cart/clear", { userId });
    return response.data;
  } catch (error) {
    console.error("Error al vaciar carrito:", error.response?.data || error.message);
    throw error;
  }
};