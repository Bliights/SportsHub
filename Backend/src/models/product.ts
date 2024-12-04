import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// Product Model
class Product extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public category!: string;
    public brand!: string;
    public imageUrl!: string;
}

Product.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        name: {type: DataTypes.STRING, allowNull: false,},
        description: {type: DataTypes.STRING, allowNull: false,},
        price: {type: DataTypes.FLOAT, allowNull: false, validate: {min: 0,},},
        category: {type: DataTypes.STRING, allowNull: false,},
        brand: {type: DataTypes.STRING, allowNull: false,},
        imageUrl: {type: DataTypes.STRING, allowNull: false, validate: {isUrl: true,},},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default Product;