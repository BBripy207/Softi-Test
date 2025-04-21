import { Request, Response } from 'express';
import Transaccion from '../models/Transaccion';
import Pago from '../models/Pago';

export const crearTransaccion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { montoTotal, numEmpleados, montoPorEmpleado, pagos } = req.body;

        // Crear la transacción
        const transaccion = await Transaccion.create({
            montoTotal,
            numEmpleados,
            montoPorEmpleado,
            fecha: new Date(),
        });

        // Crear los pagos asociados a la transacción
        if (Array.isArray(pagos)) {
            const pagoPromises = pagos.map((pago: { monto: number; metodo: string }) => {
                return Pago.create({
                    monto: pago.monto,
                    metodoPago: pago.metodo,
                    transaccionId: transaccion.id,
                    fecha: new Date(),
                });
            });

            await Promise.all(pagoPromises);
        }

        return res.status(201).json({
            success: true,
            data: {
                id: transaccion.id,
                montoTotal,
                numEmpleados,
                montoPorEmpleado,
                fecha: transaccion.fecha,
            },
        });
    } catch (error: unknown) {
        console.error('Error al crear transacción:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al procesar la transacción',
        });
    }
};

export const obtenerTransacciones = async (req: Request, res: Response) => {
    try {
        const transacciones = await Transaccion.findAll({
            include: [{ model: Pago }],
            order: [['fecha', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: transacciones,
        });
    } catch (error: unknown) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener las transacciones',
        });
    }
};

export const obtenerTransaccionPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaccion = await Transaccion.findByPk(id, {
            include: [{ model: Pago }],
        });

        if (!transaccion) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            data: transaccion,
        });
    } catch (error: unknown) {
        console.error('Error al obtener transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la transacción',
        });
    }
};

export const generarRecibo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaccion = await Transaccion.findByPk(id, {
            include: [{ model: Pago }],
        });

        if (!transaccion) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada',
            });
        }

        // En un entorno real, aquí generaríamos un PDF o un formato adecuado para recibo
        // Por ahora, simplemente retornamos los datos de la transacción formateados

        const recibo = {
            id: transaccion.id,
            fecha: transaccion.fecha,
            montoTotal: transaccion.montoTotal,
            numEmpleados: transaccion.numEmpleados,
            montoPorEmpleado: transaccion.montoPorEmpleado,
            pagos: transaccion.get('Pagos') || [],
        };

        res.status(200).json({
            success: true,
            data: recibo,
        });
    } catch (error: unknown) {
        console.error('Error al generar recibo:', error);
        res.status(500).json({
            success: false,
            error: 'Error al generar el recibo',
        });
    }
};