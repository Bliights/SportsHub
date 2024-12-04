import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// Review Model
class Review extends Model {
    public id!: number;
    public userId!: number;
    public productId!: number;
    public rating!: number;
    public comment!: string;
    public createdAt!: Date;
}

Review.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
        userId: {type: DataTypes.INTEGER, allowNull: false,},
        productId: {type: DataTypes.INTEGER, allowNull: false,},
        rating: {type: DataTypes.INTEGER, allowNull: false, validate: {min: 1, max: 5},},
        comment: {type: DataTypes.STRING, allowNull: true,},
        createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default Review;