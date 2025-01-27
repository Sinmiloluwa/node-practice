import { Sequelize } from "sequelize";
import sequelize from "../utils/database.js";

const OrderItem = sequelize.define('orderItem', {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity : Sequelize.INTEGER
});

export default OrderItem;