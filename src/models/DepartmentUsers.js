import connection from "@/config/database";
import {DataTypes} from "sequelize";
import Department from "@/models/Department";
import User from "@/models/User";


const DepartmentUser = connection.define('DepartmentUser', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.STRING
    },
    department_id: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'department_users',
    timestamps: false
});

User.hasMany(DepartmentUser, {foreignKey: 'user_id'})
DepartmentUser.belongsTo(User, {foreignKey: 'user_id'})

Department.hasMany(DepartmentUser, {foreignKey: 'department_id'})
DepartmentUser.belongsTo(Department, {foreignKey: 'department_id'})

export default DepartmentUser;