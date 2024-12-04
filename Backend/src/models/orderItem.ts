import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// OrderItem Model
class OrderItem extends Model {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public size!: string;
    public price!: number;
    public createdAt!: Date;
}

OrderItem.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        orderId: {type: DataTypes.INTEGER, allowNull: false,},
        productId: {type: DataTypes.INTEGER, allowNull: false,},
        quantity: {type: DataTypes.INTEGER, allowNull: false,},
        size: {type: DataTypes.STRING, allowNull: false,},
        price: {type: DataTypes.FLOAT, allowNull: false,},
        createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default OrderItem;