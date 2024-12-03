import { Sequelize } from "sequelize";

const sequelize = new Sequelize("SportsHubDb", "SportsHubUser", "1234", {
    host: "localhost",
    dialect: "postgres",
    logging: false,
});

export default sequelize;