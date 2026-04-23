import axios from "axios";

const APP_BASE_URL = process.env.REACT_APP_API_BASE_URL 

let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

export const http = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// --- INTERCEPTOR DE PETICIÓN ---
// Este se encarga de "pegar" el token a cada llamada que sale hacia el servidor
http.interceptors.request.use(
  (config) => {
    // Buscamos el token con la clave que vimos en tu LocalStorage
    const token = localStorage.getItem("authToken"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPUESTA ---
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Evitar bucles infinitos en la ruta de refresh
    if (originalRequest.url.includes("/auth/refresh")) {
      if (typeof logoutCallback === "function") logoutCallback();
      return Promise.reject(error);
    }

    // 2. Manejo de Token Expirado (401)
    // Si el servidor responde 401, intentamos renovar el token automáticamente
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentamos importar la lógica de refresh
        const { refresh } = await import("./auth");
        const newToken = await refresh();

        if (newToken) {
          // Si obtenemos un nuevo token, reintentamos la petición original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        console.error("No se pudo refrescar el token:", refreshError);
      }

      // Si el refresh falla, cerramos sesión
      if (typeof logoutCallback === "function") logoutCallback();
    }

    // 3. Manejo de Prohibido (403)
    // Si es 403, el usuario no tiene permisos o el token es totalmente inválido
    if (error.response?.status === 403) {
      console.warn("Acceso prohibido (403). Redirigiendo o limpiando...");
      // Opcional: podrías forzar el logout aquí si consideras que 403 es crítico
      // if (typeof logoutCallback === "function") logoutCallback();
    }

    return Promise.reject(error);
  }
);