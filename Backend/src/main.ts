import express from "express";
import swaggerUi from "swagger-ui-express";
import sequelize from "./config/database";
import swaggerDoc from "./config/swagger";
import userRouter from "./routes/userRoute";
import preferencesRouter from "./routes/preferencesRoute";
import initializeModels from './models/associations';
import User from './models/user';
import Preferences from './models/preferences';
import HelpTicket from './models/helpTicket';
import HelpTicketResponse from './models/helpTicketResponse';
import Review from './models/review';
import Product from './models/product';
import CartItem from './models/cartItem';
import Order from './models/order';
import OrderItem from './models/orderItem';
import Stock from './models/stock';


initializeModels();
const app = express();
app.use(express.json());

// Swagger Documentation
const swaggerUiOptions = {swaggerOptions: {defaultModelsExpandDepth: -1, defaultModelExpandDepth: -1, showModels: false,},};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.get("/api-docs", swaggerUi.setup(swaggerDoc, swaggerUiOptions));

app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(swaggerDoc);
});


// Routes
app.use("/api/users", userRouter);
app.use("/api/preferences", preferencesRouter);




console.log("starting...");
app.listen(3000, () => {
    console.log("Ok, started port 3000, please open http://localhost:3000/api-docs");
});
(async () => {
    try {
        // Synchronize the model with the database
        await sequelize.sync({ force: true });

        // Insert Users
        const user1 = await User.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '1234',
            role: 'customer',
        });

        const user2 = await User.create({
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            password: '1234',
            role: 'admin',
        });

        // Insert Preferences
        await Preferences.create({
            userId: user1.id,
        });

        // Insert Products
        const product1 = await Product.create({
            name: 'Football',
            description: 'Official size and weight football for matches.',
            price: 25.99,
            category: 'Team Sports',
            brand: 'Nike',
            imageUrl: 'https://example.com/images/football.jpg',
        });

        const product2 = await Product.create({
            name: 'Basketball',
            description: 'Durable outdoor basketball.',
            price: 30.99,
            category: 'Team Sports',
            brand: 'Spalding',
            imageUrl: 'https://example.com/images/basketball.jpg',
        });

        // Insert Stock
        await Stock.create({
            productId: product1.id,
            size: 'Standard',
            quantity: 100,
        });

        await Stock.create({
            productId: product2.id,
            size: 'Standard',
            quantity: 50,
        });

        // Insert Reviews
        await Review.create({
            userId: user1.id,
            productId: product1.id,
            rating: 5,
            comment: 'Great football, excellent grip and durability!',
        });

        // Insert Cart Items
        await CartItem.create({
            userId: user1.id,
            productId: product1.id,
            quantity: 2,
            size: 'Standard',
        });

        await CartItem.create({
            userId: user1.id,
            productId: product2.id,
            quantity: 1,
            size: 'Standard',
        });

        // Insert Orders
        const order1 = await Order.create({
            userId: user1.id,
            totalPrice: 81.97,
            shippingAddress: '123 Sports Street, Cityville, USA',
        });

        // Insert Order Items
        await OrderItem.create({
            orderId: order1.id,
            productId: product1.id,
            quantity: 2,
            size: 'Standard',
            price: 25.99,
        });

        await OrderItem.create({
            orderId: order1.id,
            productId: product2.id,
            quantity: 1,
            size: 'Standard',
            price: 30.99,
        });

        // Insert HelpTickets and Responses
        const ticket1 = await HelpTicket.create({
            userId: user1.id,
            subject: 'Delivery Issue',
            description: 'My order hasn’t arrived yet.',
        });

        await HelpTicketResponse.create({
            ticketId: ticket1.id,
            userId: user2.id,
            response: 'We’re looking into the issue and will update you shortly.',
        });

        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting data:", error);
    }
})();