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
// HelpTicketResponse Model
var HelpTicketResponse = /** @class */ (function (_super) {
    __extends(HelpTicketResponse, _super);
    function HelpTicketResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HelpTicketResponse;
}(sequelize_1.Model));
HelpTicketResponse.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
    ticketId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
    response: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW, },
}, {
    sequelize: database_1.default,
    timestamps: false,
});
exports.default = HelpTicketResponse;
