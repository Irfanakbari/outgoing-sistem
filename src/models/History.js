import connection from "@/config/database";
import {DataTypes} from "sequelize";


const History = connection.define('History', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_part: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'history',
    createdAt: 'timestamp',
    updatedAt: false
});

export default History;