import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";


// User Model
class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: "customer" | "admin";
}

User.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
        password: {type: DataTypes.STRING, allowNull: false},
        role: {type: DataTypes.ENUM("customer", "admin"), allowNull: false, defaultValue: "customer"},
    },
    {
        sequelize,
        timestamps: false,
    }
);

export default User;
