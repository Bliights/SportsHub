import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// Stock Model
class Stock extends Model {
    public id!: number;
    public productId!: number;
    public quantity!: number;
    public size!: string;
}

Stock.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        productId: {type: DataTypes.INTEGER, allowNull: false,},
        quantity: {type: DataTypes.INTEGER, allowNull: false,},
        size: {type: DataTypes.STRING, allowNull: true,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default Stock;