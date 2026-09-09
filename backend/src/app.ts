import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend Todo Praktikum Berjalan Mulus!',
  });
});

// API Routes
app.use('/api', apiRoutes);

export default app;
