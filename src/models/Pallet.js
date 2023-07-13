import connection from "@/config/database";
import {DataTypes} from "sequelize";
import History from "@/models/History";
import Customer from "@/models/Customer";

const Pallet = connection.define('Pallet', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    customer: {
        type: DataTypes.STRING
    },
    vehicle: {
        type: DataTypes.STRING
    },
    part: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'pallets',
    createdAt: false,
    updatedAt: 'updated_at'
});

Pallet.hasMany(History, { foreignKey: 'id_pallet' });
History.belongsTo(Pallet, { foreignKey: 'id_pallet' });

Customer.hasMany(Pallet, { foreignKey: 'customer' });
Pallet.belongsTo(Customer, { foreignKey: 'customer' });

export default Pallet;