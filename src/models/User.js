import connection from "@/config/database";
import {DataTypes} from "sequelize";
import { v4 as uuidv4 } from 'uuid';


const User = connection.define('User', {
    // Model attributes are defined here
    uid: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: false
});


export default User;