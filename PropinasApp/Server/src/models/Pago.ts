import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Transaccion from './Transaccion';

interface PagoAttributes {
    id?: number;
    monto: number;
    metodoPago: string;
    transaccionId: number;
    fecha: Date;
}

class Pago extends Model<PagoAttributes> implements PagoAttributes {
    public id!: number;
    public monto!: number;
    public metodoPago!: string;
    public transaccionId!: number;
    public fecha!: Date;
}

Pago.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        metodoPago: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        transaccionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Transaccion,
                key: 'id',
            },
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'pagos',
    }
);

// Establecer relación
Pago.belongsTo(Transaccion, { foreignKey: 'transaccionId' });
Transaccion.hasMany(Pago, { foreignKey: 'transaccionId' });

Pago.belongsTo(Transaccion, { foreignKey: 'transaccionId' });
Transaccion.hasMany(Pago, { foreignKey: 'transaccionId' });

export default Pago;