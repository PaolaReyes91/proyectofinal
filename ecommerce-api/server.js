import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';

// 1. Configuración de entorno - carga el archivo correcto según NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// 2. Manejo de errores globales (Excepciones no capturadas)
setupGlobalErrorHandlers();

const app = express();

// 3. Conexión a la Base de Datos (MongoDB Atlas)
dbConnection();

// 4. Middlewares de seguridad y parseo
app.use(express.json());

// --- CONFIGURACIÓN DE CORS ---
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin o en producción
    if (!origin || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    if (corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

// 5. Logger de peticiones (opcional, según tu middleware)
// app.use(logger); 

// 6. Ruta de bienvenida / salud del servidor
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '¡BIENVENIDO AL BACKEND DE SHE LEADS ACADEMY!',
    status: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 7. Definición de Rutas de la API
// Esto hará que tus rutas sean: https://tu-url.onrender.com/api/auth/login
app.use('/api', routes);

// 8. Manejador de Rutas No Encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada en el servidor',
    method: req.method,
    url: req.originalUrl
  });
});

// 9. Middleware de manejo de errores final
app.use(errorHandler);

// 10. Inicio del servidor
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
    console.log(`📍 URL local: http://localhost:${PORT}`);
  });
}

export default app;