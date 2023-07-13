import connection from "@/config/database";
import {DataTypes} from "sequelize";
import Customer from "@/models/Customer";
import Part from "@/models/Part";
import Pallet from "@/models/Pallet";


const Vehicle = connection.define('Vehicle', {
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
    }
}, {
    tableName: 'vehicle',
    timestamps: false
});

Customer.hasMany(Vehicle, { foreignKey: 'customer' });
Vehicle.belongsTo(Customer, { foreignKey: 'customer' });

Vehicle.hasMany(Pallet, { foreignKey: 'vehicle' });
Pallet.belongsTo(Vehicle, { foreignKey: 'vehicle' });


export default Vehicle;