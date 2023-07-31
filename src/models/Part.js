import connection from "@/config/database";
import {DataTypes} from "sequelize";


const Part = connection.define('Part', {
    // Model attributes are defined here
    id_part: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'parts',
    timestamps: false
});

export default Part;