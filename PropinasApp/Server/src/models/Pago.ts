// server/src/models/Pago.ts
import TransaccionModel from './Transaccion';

interface Pago {
    id: number;
    monto: number;
    metodoPago: string;
    transaccionId: number;
    fecha: Date;
}

class PagoModel {
    public static pagos: Pago[] = [];

    public static async create(monto: number, metodoPago: string, transaccionId: number): Promise<Pago> {
        const pago: Pago = {
            id: this.pagos.length + 1, // ID único
            monto,
            metodoPago,
            transaccionId,
            fecha: new Date(),
        };

        this.pagos.push(pago);
        return pago;
    }

    public static async findAllByTransaccionId(transaccionId: number): Promise<Pago[]> {
        return this.pagos.filter((pago) => pago.transaccionId === transaccionId);
    }
}

export default PagoModel;
