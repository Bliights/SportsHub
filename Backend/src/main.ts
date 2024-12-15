import express from "express";
import swaggerUi from "swagger-ui-express";
import sequelize from "./config/database";
import swaggerDoc from "./config/swagger";
import userRouter from "./routes/userRoute";
import preferenceRouter from "./routes/preferenceRoute";
import helpTicketRouter from "./routes/helpTicketRoute";
import cartItemRouter from "./routes/cartItemRoute";
import helpTicketResponseRouter from "./routes/helpTicketResponseRoute";
import orderRouter from "./routes/orderRoute";
import productRouter from "./routes/productRoute";
import reviewRouter from "./routes/reviewRoute";
import stockRouter from "./routes/stockRoute";
import orderItemRouter from "./routes/orderItemRoute";
import initializeModels from './models/associations';
import User from './models/user';
import Preferences from './models/preference';
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
app.use("/api/users", preferenceRouter);
app.use("/api/users", cartItemRouter);

app.use("/api", reviewRouter);
app.use("/api", helpTicketRouter);
app.use("/api", orderRouter);

app.use("/api/help-tickets", helpTicketResponseRouter);

app.use("/api/products", productRouter);
app.use("/api/products", stockRouter);

app.use("/api/orders", orderItemRouter);




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
            category: 'Equipment',
            brand: 'Nike',
            imageUrl: 'https://m.media-amazon.com/images/I/61qUB5uSx5L._AC_SL1500_.jpg',
        });

        const product2 = await Product.create({
            name: 'Basketball',
            description: 'Durable outdoor basketball.',
            price: 30.99,
            category: 'Equipment',
            brand: 'Spalding',
            imageUrl: 'https://media.carrefour.fr/medias/3202dd92cc93313daa8b79248c7cd84c/p_1500x1500/1463f12dce37475c9934cf0f6c30afe2-image.jpg',
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