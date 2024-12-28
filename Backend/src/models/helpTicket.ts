import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// HelpTicket Model
class HelpTicket extends Model {
    public id!: number;
    public userId!: number;
    public subject!: string;
    public description!: string;
    public status!: "open" | "in_progress" | "closed";
    public createdAt!: Date
    public updatedAt!: Date | null;
    public closedAt!: Date | null;
}

HelpTicket.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        userId: {type: DataTypes.INTEGER, allowNull: false,},
        subject: {type: DataTypes.STRING, allowNull: false,},
        description: {type: DataTypes.STRING, allowNull: false,},
        status: {type: DataTypes.ENUM("open", "in_progress", "closed"), allowNull: false, defaultValue: "open",},
        createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,},
        updatedAt: {type: DataTypes.DATE, allowNull: true,},
        closedAt: {type: DataTypes.DATE, allowNull: true,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default HelpTicket;