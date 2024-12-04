import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// Order Model
class Order extends Model {
    public id!: number;
    public userId!: number;
    public status!: "pending" | "shipped" | "delivered";
    public totalPrice!: number;
    public createdAt!: Date;
    public closedAt!: Date | null;
}

Order.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        userId: {type: DataTypes.INTEGER, allowNull: false,},
        status: {type: DataTypes.ENUM("pending", "shipped", "delivered"), allowNull: false, defaultValue: "pending",},
        totalPrice: {type: DataTypes.FLOAT, allowNull: false,},
        createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,},
        closedAt: {type: DataTypes.DATE, allowNull: true,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default Order;