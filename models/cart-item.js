import { Sequelize } from "sequelize";
import sequelize from "../utils/database.js";

const CartItem = sequelize.define('cart_items', {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quamtity : Sequelize.INTEGER
});

export default CartItem;