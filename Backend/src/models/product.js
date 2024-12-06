"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var database_1 = require("../config/database");
// Product Model
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Product;
}(sequelize_1.Model));
Product.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    price: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, validate: { min: 0, }, },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    brand: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    imageUrl: { type: sequelize_1.DataTypes.STRING, allowNull: false, validate: { isUrl: true, }, },
}, {
    sequelize: database_1.default,
    timestamps: false,
});
exports.default = Product;
