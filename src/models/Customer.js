import connection from "@/config/database";
import {DataTypes} from "sequelize";


const Customer = connection.define('Customer', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'customer',
    timestamps: false
});

export default Customer;