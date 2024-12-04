import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// CartItem Model
class CartItem extends Model {
    public id!: number;
    public userId!: number;
    public productId!: number;
    public quantity!: number;
    public size!: string;
    public createdAt!: Date;
}

CartItem.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        userId: {type: DataTypes.INTEGER, allowNull: false,},
        productId: {type: DataTypes.INTEGER, allowNull: false,},
        quantity: {type: DataTypes.INTEGER, allowNull: false,},
        size: {type: DataTypes.STRING, allowNull: false,},
        createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default CartItem;