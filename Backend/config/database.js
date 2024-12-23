import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Emp', 'postgres', 'sbamo', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;