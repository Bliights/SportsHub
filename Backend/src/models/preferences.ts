import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// Preferences Model
class Preferences extends Model {
    public id!: number;
    public userId!: number;
    public receiveNotification!: boolean;
    public theme!: "light" | "dark";
    public newsLetter!: boolean;
}

Preferences.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        userId: {type: DataTypes.INTEGER, allowNull: false,},
        receiveNotification: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true,},
        theme: {type: DataTypes.ENUM("light", "dark"), allowNull: false, defaultValue: "light",},
        newsLetter: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default Preferences;