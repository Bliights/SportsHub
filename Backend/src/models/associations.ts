import User from './user';
import Preferences from './preferences';
import HelpTicket from './helpTicket';
import HelpTicketResponse from "./helpTicketResponse";
import Review from './review';
import Product from './product';
import Order from './order';
import OrderItem from './orderItem';
import CartItem from './cartItem';
import Stock from "./stock";

const initializeModels = () => {
    // User - Preferences Association
    User.hasOne(Preferences, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Preferences.belongsTo(User, { foreignKey: 'userId' });

    // User - HelpTicket Association
    User.hasMany(HelpTicket, { foreignKey: 'userId' });
    HelpTicket.belongsTo(User, { foreignKey: 'userId' });

    // HelpTicket - HelpTicketResponse Association
    HelpTicket.hasMany(HelpTicketResponse, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
    HelpTicketResponse.belongsTo(HelpTicket, { foreignKey: 'ticketId' });

    // User - HelpTicketResponse Association
    User.hasMany(HelpTicketResponse, { foreignKey: 'userId' });
    HelpTicketResponse.belongsTo(User, { foreignKey: 'userId' });

    // User - Review Association
    User.hasMany(Review, { foreignKey: 'userId' });
    Review.belongsTo(User, { foreignKey: 'userId' });

    // Product - Review Association
    Product.hasMany(Review, { foreignKey: 'productId' });
    Review.belongsTo(Product, { foreignKey: 'productId' });

    // User - CartItem Association
    User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
    CartItem.belongsTo(User, { foreignKey: 'userId' });

    // Product - CartItem Association
    Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
    CartItem.belongsTo(Product, { foreignKey: 'productId' });

    // User - Order Association
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });

    // Order - OrderItem Association
    Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

    // Product - OrderItem Association
    Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
    OrderItem.belongsTo(Product, { foreignKey: 'productId' });

    // Product - Stock Association
    Product.hasMany(Stock, { foreignKey: 'productId', onDelete: 'CASCADE' });
    Stock.belongsTo(Product, { foreignKey: 'productId' });

};

export default initializeModels;