import { Sequelize } from 'sequelize';

// Configuración de la base de datos SQLite para simplificar
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
});

export const configureDb = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        await sequelize.sync({ force: true });
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error: unknown) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
};

export default sequelize;