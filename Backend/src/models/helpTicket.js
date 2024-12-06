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
// HelpTicket Model
var HelpTicket = /** @class */ (function (_super) {
    __extends(HelpTicket, _super);
    function HelpTicket() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HelpTicket;
}(sequelize_1.Model));
HelpTicket.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
    subject: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    status: { type: sequelize_1.DataTypes.ENUM("open", "in_progress", "resolved", "closed"), allowNull: false, defaultValue: "open", },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW, },
    closedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true, },
}, {
    sequelize: database_1.default,
    timestamps: false,
});
exports.default = HelpTicket;
