import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// HelpTicketResponse Model
class HelpTicketResponse extends Model {
    public id!: number;
    public userId!: number;
    public ticketId!: number;
    public response!: string;
    public createdAt!: Date;
}

HelpTicketResponse.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        userId: {type: DataTypes.INTEGER, allowNull: false,},
        ticketId: {type: DataTypes.INTEGER, allowNull: false,},
        response: {type: DataTypes.STRING, allowNull: false,},
        createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default HelpTicketResponse;