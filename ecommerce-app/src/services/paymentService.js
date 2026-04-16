import { http } from "./http";

export const getPaymentMethods = async () => {
  try {
    // 1. Recuperamos la información del usuario del LocalStorage
    const userDataStr = localStorage.getItem("userData");
    
    if (!userDataStr) {
      console.warn("No hay sesión activa. Devolviendo lista vacía.");
      return [];
    }

    const userData = JSON.parse(userDataStr);
    
    // 2. Extraemos el ID. En tu captura se ve claramente como "_id"
    const userId = userData._id || userData.id;

    if (!userId) {
      console.error("El objeto userData no contiene un ID válido.");
      return [];
    }

    // 3. Llamamos a la ruta que configuraste en tu Backend: /user/:userId
    // Cambiamos "me" por el ID real para evitar el Error 500 y 404
    const response = await http.get(`payment-methods/user/${userId}`);
    
    // Devolvemos los datos o un arreglo vacío si no hay tarjetas
    return response.data || [];
  } catch (error) {
    // Si el error es 404 (No hay tarjetas aún), devolvemos array vacío en lugar de explotar
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Error al obtener métodos de pago:", error);
    throw error;
  }
};

export const createPaymentMethod = async (paymentData) => {
  try {
    const userDataStr = localStorage.getItem("userData");
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    const userId = userData?._id || userData?.id;

    if (!userId) {
      throw new Error("No se encontró un ID de usuario válido. Inicia sesión de nuevo.");
    }

    // Unimos los datos del formulario con los datos obligatorios del backend
    const dataWithUser = { 
      ...paymentData, 
      user: userId,
      // IMPORTANTE: Tu modelo requiere 'type'. 
      // Como este formulario es de tarjetas, lo hardcodeamos o lo detectamos:
      type: 'credit_card' 
    };

    console.log("Datos enviados al backend:", dataWithUser);

    const response = await http.post("payment-methods", dataWithUser);
    return response.data;
  } catch (error) {
    // Si el backend responde, imprimimos el mensaje exacto para saber qué falló
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    }
    console.error("Error al crear método de pago:", error.message);
    throw error;
  }
};


export const updatePaymentMethod = async (id, paymentData) => {
  try {
    const response = await http.put(`payment-methods/${id}`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar método de pago:", error);
    throw error;
  }
};

export const deletePaymentMethod = async (id) => {
  try {
    const response = await http.delete(`payment-methods/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar método de pago:", error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (id) => {
  try {
    const response = await http.patch(`payment-methods/${id}/set-default`);
    return response.data;
  } catch (error) {
    console.error("Error al establecer método predeterminado:", error);
    throw error;
  }
};