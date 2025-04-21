// server/src/controllers/transaccionesController.ts
import { Request, Response } from 'express';
import TransaccionModel from '../models/Transaccion';
import PagoModel from '../models/Pago';

export const crearTransaccion = async (req: Request, res: Response) => {
    try {
        const { montoTotal, numEmpleados, montoPorEmpleado, pagos } = req.body;

        // Crear la transacción
        const transaccion = await TransaccionModel.create(montoTotal, numEmpleados, montoPorEmpleado);

        // Crear los pagos asociados a la transacción
        if (pagos && pagos.length > 0) {
            const pagoPromises = pagos.map((pago: any) => {
                return PagoModel.create(pago.monto, pago.metodoPago, transaccion.id);
            });

            await Promise.all(pagoPromises);
        }

        res.status(201).json({
            success: true,
            data: {
                id: transaccion.id,
                montoTotal,
                numEmpleados,
                montoPorEmpleado,
                fecha: transaccion.fecha
            }
        });
    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar la transacción'
        });
    }
};

export const obtenerTransacciones = async (req: Request, res: Response) => {
    try {
        const transacciones = await TransaccionModel.findAll();

        res.status(200).json({
            success: true,
            data: transacciones
        });
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener las transacciones'
        });
    }
};

export const obtenerTransaccionPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaccion = await TransaccionModel.findById(parseInt(id));

        if (!transaccion) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada'
            });
        }

        const pagos = await PagoModel.findAllByTransaccionId(transaccion.id);

        res.status(200).json({
            success: true,
            data: {
                ...transaccion,
                pagos
            }
        });
    } catch (error) {
        console.error('Error al obtener transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la transacción'
        });
    }
};

export const generarRecibo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaccion = await TransaccionModel.findById(parseInt(id));

        if (!transaccion) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada'
            });
        }

        const recibo = {
            id: transaccion.id,
            fecha: transaccion.fecha,
            montoTotal: transaccion.montoTotal,
            numEmpleados: transaccion.numEmpleados,
            montoPorEmpleado: transaccion.montoPorEmpleado,
            pagos: await PagoModel.findAllByTransaccionId(transaccion.id)
        };

        res.status(200).json({
            success: true,
            data: recibo
        });
    } catch (error) {
        console.error('Error al generar recibo:', error);
        res.status(500).json({
            success: false,
            error: 'Error al generar el recibo'
        });
    }
};
