import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';

dotenv.config();

setupGlobalErrorHandlers();

const app = express();
dbConnection();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: [ 'GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('WELCOME!');
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    url: req.originalUrl
  });
});


app.use(errorHandler);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
