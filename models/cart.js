import { Sequelize } from "sequelize";
import sequelize from "../utils/database.js";

const Cart = sequelize.define('carts', {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

export default Cart;