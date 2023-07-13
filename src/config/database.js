import {Sequelize} from "sequelize";

const connection = new Sequelize('vuteq', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    // logging: msg => logger.debug(msg),
});
export default connection