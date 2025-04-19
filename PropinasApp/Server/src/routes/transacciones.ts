// server/src/routes/transacciones.ts
import express from 'express';

interface Transaccion {
    id: number;
    montoTotal: number;
    numEmpleados: number;
    montoPorEmpleado: number;
    fecha: Date;
}

interface Pago {
    id: number;
    monto: number;
    metodoPago: string;
    transaccionId: number;
    fecha: Date;
}

const router = express.Router();

// Arreglos en memoria para almacenar las transacciones y los pagos
let transacciones: Transaccion[] = [];
let pagos: Pago[] = [];
let transaccionIdCounter = 1;
let pagoIdCounter = 1;

// Crear una transacción
router.post('/', (req, res) => {
    const { montoTotal, numEmpleados, montoPorEmpleado } = req.body;
    const transaccion: Transaccion = {
        id: transaccionIdCounter++,
        montoTotal,
        numEmpleados,
        montoPorEmpleado,
        fecha: new Date(),
    };

    transacciones.push(transaccion);
    res.status(201).json(transaccion);
});

// Crear un pago
router.post('/:id/pagos', (req, res) => {
    const { id } = req.params;
    const { monto, metodoPago } = req.body;

    const transaccion = transacciones.find(t => t.id === parseInt(id));

    if (!transaccion) {
        return res.status(404).json({ error: 'Transacción no encontrada.' });
    }

    const pago: Pago = {
        id: pagoIdCounter++,
        monto,
        metodoPago,
        transaccionId: transaccion.id,
        fecha: new Date(),
    };

    pagos.push(pago);
    res.status(201).json(pago);
});

// Obtener todas las transacciones
router.get('/', (req, res) => {
    res.json(transacciones);
});

// Obtener los pagos de una transacción
router.get('/:id/pagos', (req, res) => {
    const { id } = req.params;
    const pagosTransaccion = pagos.filter(pago => pago.transaccionId === parseInt(id));

    if (!pagosTransaccion.length) {
        return res.status(404).json({ error: 'No se encontraron pagos para esta transacción.' });
    }

    res.json(pagosTransaccion);
});

export { router as transaccionesRouter };
