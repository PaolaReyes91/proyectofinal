import { http } from "./http";

/**
 * Crea una nueva orden desde el Checkout.
 * URL: POST http://127.0.0.1:4000/api/orders
 */
export const createOrder = async (orderData) => {
  try {
    // Agregamos la barra diagonal inicial para asegurar que parta de la baseURL configurada en axios
    const response = await http.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la orden:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene el historial de órdenes del usuario logueado.
 * URL: GET http://127.0.0.1:4000/api/orders/my-orders
 */
export const getMyOrders = async () => {
  try {
    /**
     * IMPORTANTE: Usamos la ruta absoluta hacia el backend para evitar que 
     * el navegador cargue la ruta de React (localhost:3000/orders).
     */
    const response = await http.get("/orders/my-orders");
    
    // Log para depuración en consola
    console.log("Respuesta de la API de órdenes:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al obtener mis órdenes:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene el detalle de una orden específica por su ID.
 * URL: GET http://127.0.0.1:4000/api/orders/:id
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await http.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle de la orden:", error.response?.data || error.message);
    throw error;
  }
};