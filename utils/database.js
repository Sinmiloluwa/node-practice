import { Sequelize } from "sequelize";

const sequelize = new Sequelize('node-practice', 'root', '', {
    dialect: 'mysql', 
    host: 'localhost'
});

export default sequelize;