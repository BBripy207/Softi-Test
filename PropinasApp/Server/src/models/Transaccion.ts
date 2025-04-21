// server/src/models/Transaccion.ts

interface Transaccion {
    id: number;
    montoTotal: number;
    numEmpleados: number;
    montoPorEmpleado: number;
    fecha: Date;
}

// Aquí no se necesita la conexión a la base de datos. Vamos a dejar la lógica de la clase vacía
class TransaccionModel {
    public static transacciones: Transaccion[] = [];

    public static async create(montoTotal: number, numEmpleados: number, montoPorEmpleado: number): Promise<Transaccion> {
        const transaccion: Transaccion = {
            id: this.transacciones.length + 1, // ID único
            montoTotal,
            numEmpleados,
            montoPorEmpleado,
            fecha: new Date(),
        };

        this.transacciones.push(transaccion);
        return transaccion;
    }

    public static async findAll(): Promise<Transaccion[]> {
        return this.transacciones;
    }

    public static async findById(id: number): Promise<Transaccion | undefined> {
        return this.transacciones.find((transaccion) => transaccion.id === id);
    }
}

export default TransaccionModel;
