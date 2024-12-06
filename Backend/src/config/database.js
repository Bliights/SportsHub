"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize("SportsHubDb", "SportsHubUser", "1234", {
    host: "localhost",
    dialect: "postgres",
    logging: false,
});
exports.default = sequelize;
