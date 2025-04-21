import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface TransaccionAttributes {
    id?: number;
    montoTotal: number;
    numEmpleados: number;
    montoPorEmpleado: number;
    fecha: Date;
}

class Transaccion extends Model<TransaccionAttributes> implements TransaccionAttributes {
    public id!: number;
    public montoTotal!: number;
    public numEmpleados!: number;
    public montoPorEmpleado!: number;
    public fecha!: Date;
}

Transaccion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        montoTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        numEmpleados: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        montoPorEmpleado: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'transacciones',
    }
);

export default Transaccion;