import express, { Request, Response, NextFunction } from 'express';
import logger from './Utils/WistonConfig';
import dotenv from 'dotenv';
import MainRoute from './routes/Main';
import { ConnectDb } from './connect/db';
import cors from 'cors';

dotenv.config();

const app = express();
const MONGO_URL = process.env.MONGOURL || '';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/', MainRoute);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Page Not Found' });
});

// Error Handler
app.use((err: { status: number; message: string; stack: string }, req: Request, res: Response, next: NextFunction) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || 'Internal Server Error';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

// Connect to MongoDB (Vercel will call this when the function is invoked)
ConnectDb(MONGO_URL).catch((error) => {
  logger.error('Failed to connect to MongoDB:', error);
});

// Export the app for Vercel
export default app;