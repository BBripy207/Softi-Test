// server/src/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { transaccionesRouter } from './routes/transacciones';

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar rutas
app.use('/api/transacciones', transaccionesRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de gestión de propinas funcionando correctamente.');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
