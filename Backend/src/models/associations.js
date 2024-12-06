"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var preference_1 = require("./preference");
var helpTicket_1 = require("./helpTicket");
var helpTicketResponse_1 = require("./helpTicketResponse");
var review_1 = require("./review");
var product_1 = require("./product");
var order_1 = require("./order");
var orderItem_1 = require("./orderItem");
var cartItem_1 = require("./cartItem");
var stock_1 = require("./stock");
var initializeModels = function () {
    // User - Preferences Association
    user_1.default.hasOne(preference_1.default, { foreignKey: 'userId', onDelete: 'CASCADE' });
    preference_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
    // User - HelpTicket Association
    user_1.default.hasMany(helpTicket_1.default, { foreignKey: 'userId' });
    helpTicket_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
    // HelpTicket - HelpTicketResponse Association
    helpTicket_1.default.hasMany(helpTicketResponse_1.default, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
    helpTicketResponse_1.default.belongsTo(helpTicket_1.default, { foreignKey: 'ticketId' });
    // User - HelpTicketResponse Association
    user_1.default.hasMany(helpTicketResponse_1.default, { foreignKey: 'userId' });
    helpTicketResponse_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
    // User - Review Association
    user_1.default.hasMany(review_1.default, { foreignKey: 'userId' });
    review_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
    // Product - Review Association
    product_1.default.hasMany(review_1.default, { foreignKey: 'productId' });
    review_1.default.belongsTo(product_1.default, { foreignKey: 'productId' });
    // User - CartItem Association
    user_1.default.hasMany(cartItem_1.default, { foreignKey: 'userId', onDelete: 'CASCADE' });
    cartItem_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
    // Product - CartItem Association
    product_1.default.hasMany(cartItem_1.default, { foreignKey: 'productId', onDelete: 'CASCADE' });
    cartItem_1.default.belongsTo(product_1.default, { foreignKey: 'productId' });
    // User - Order Association
    user_1.default.hasMany(order_1.default, { foreignKey: 'userId' });
    order_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
    // Order - OrderItem Association
    order_1.default.hasMany(orderItem_1.default, { foreignKey: 'orderId', onDelete: 'CASCADE' });
    orderItem_1.default.belongsTo(order_1.default, { foreignKey: 'orderId' });
    // Product - OrderItem Association
    product_1.default.hasMany(orderItem_1.default, { foreignKey: 'productId', onDelete: 'CASCADE' });
    orderItem_1.default.belongsTo(product_1.default, { foreignKey: 'productId' });
    // Product - Stock Association
    product_1.default.hasMany(stock_1.default, { foreignKey: 'productId', onDelete: 'CASCADE' });
    stock_1.default.belongsTo(product_1.default, { foreignKey: 'productId' });
};
exports.default = initializeModels;
