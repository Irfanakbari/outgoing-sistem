import connection from "@/config/database";
import {DataTypes} from "sequelize";
import Pallet from "@/models/Pallet";
import Department from "@/models/Department";
import Customer from "@/models/Customer";
import Part from "@/models/Part";


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
    department: {
        type: DataTypes.STRING
    },
    customer: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'vehicle',
    timestamps: false
});

Department.hasMany(Vehicle, { foreignKey: 'department' });
Vehicle.belongsTo(Department, { foreignKey: 'department' });

Customer.hasMany(Vehicle, { foreignKey: 'customer' });
Vehicle.belongsTo(Customer, { foreignKey: 'customer' });

Vehicle.hasMany(Pallet, { foreignKey: 'vehicle' });
Pallet.belongsTo(Vehicle, { foreignKey: 'vehicle' });

Vehicle.hasMany(Part, { foreignKey: 'vehicle' });
Part.belongsTo(Vehicle, { foreignKey: 'vehicle' });


export default Vehicle;