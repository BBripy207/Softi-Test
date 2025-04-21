import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { transaccionesRouter } from './routes/transactions';
import { configureDb } from './config/database';

// Initialize the application
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure database
configureDb().catch((error: unknown) => {
    console.error('Error configuring the database:', error);
});

// Configure routes
app.use('/api/transacciones', transaccionesRouter);

// Test route
app.get('/', (req: Request, res: Response) => {
    res.send('Tips management API running successfully.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});