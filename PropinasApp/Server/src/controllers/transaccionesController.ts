import { Request, Response } from 'express';
import Transaccion from '../models/Transaccion';
import Pago from '../models/Pago';

export const crearTransaccion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { totalAmount, employeeCount, amountPerEmployee, payments } = req.body;

        // Create the transaction
        const transaction = await Transaccion.create({
            montoTotal: totalAmount,
            numEmpleados: employeeCount,
            montoPorEmpleado: amountPerEmployee,
            fecha: new Date(),
        });

        // Create the payments associated with the transaction
        if (Array.isArray(payments)) {
            const paymentPromises = payments.map((payment: { amount: number; method: string }) => {
                return Pago.create({
                    monto: payment.amount,
                    metodoPago: payment.method,
                    transaccionId: transaction.id,
                    fecha: new Date(),
                });
            });

            await Promise.all(paymentPromises);
        }

        return res.status(201).json({
            success: true,
            data: {
                id: transaction.id,
                totalAmount,
                employeeCount,
                amountPerEmployee,
                date: transaction.fecha,
            },
        });
    } catch (error: unknown) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({
            success: false,
            error: 'Error processing the transaction',
        });
    }
};

export const obtenerTransacciones = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaccion.findAll({
            include: [{ model: Pago }],
            order: [['fecha', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error: unknown) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching transactions',
        });
    }
};

export const obtenerTransaccionPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaction = await Transaccion.findByPk(id, {
            include: [{ model: Pago }],
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found',
            });
        }

        res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error: unknown) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching the transaction',
        });
    }
};

export const generarRecibo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const transaction = await Transaccion.findByPk(id, {
            include: [{ model: Pago }],
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found',
            });
        }

        // In a real environment, generate a PDF or appropriate receipt format here
        // For now, return the formatted transaction data

        const receipt = {
            id: transaction.id,
            date: transaction.fecha,
            totalAmount: transaction.montoTotal,
            employeeCount: transaction.numEmpleados,
            amountPerEmployee: transaction.montoPorEmpleado,
            payments: transaction.get('Pagos') || [],
        };

        res.status(200).json({
            success: true,
            data: receipt,
        });
    } catch (error: unknown) {
        console.error('Error generating receipt:', error);
        res.status(500).json({
            success: false,
            error: 'Error generating the receipt',
        });
    }
};