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

// Swagger JSON
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
        const user1 = await User.create({name: 'John Doe', email: 'john.doe@example.com', password: '1234', role: 'customer'});
        const user2 = await User.create({name: 'Jane Smith', email: 'jane.smith@example.com', password: '1234', role: 'admin'});
        const user3 = await User.create({name: 'Louis', email: 'Louis@example.com', password: '1234', role: 'customer'});
        const user4 = await User.create({name: 'Clément', email: 'clement@example.com', password: '1234', role: 'customer'});
        const user5 = await User.create({name: 'Claude', email: 'claude@example.com', password: '1234', role: 'customer'});
        const user6 = await User.create({name: 'Catherine', email: 'claude@example.com', password: '1234', role: 'customer'});
        const user7 = await User.create({name: 'Marie', email: 'marie@example.com', password: '1234', role: 'customer'});
        const user8 = await User.create({name: 'Sarah', email: 'sarah@example.com', password: '1234', role: 'customer'});
        const user9 = await User.create({name: 'Aubin', email: 'aubin@example.com', password: '1234', role: 'customer'});
        const user10 = await User.create({name: 'Jeremy', email: 'jeremy@example.com', password: '1234', role: 'customer'});

        // Insert Preferences
        await Preferences.create({userId: user1.id,});
        await Preferences.create({userId: user2.id,});
        await Preferences.create({userId: user3.id,});
        await Preferences.create({userId: user4.id,});
        await Preferences.create({userId: user5.id,});
        await Preferences.create({userId: user6.id,});
        await Preferences.create({userId: user7.id,});
        await Preferences.create({userId: user8.id,});
        await Preferences.create({userId: user9.id,});
        await Preferences.create({userId: user10.id,});

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
        const product3 = await Product.create({
            name: 'adidas-duramo-black',
            description: 'Really nice shoes.',
            price: 149.99,
            category: 'Clothe',
            brand: 'adidas',
            imageUrl: 'https://picou-montagne.com/wp-content/uploads/2022/03/adidas-duramo-noir-chaussure-running-homme-1.jpg',
        });
        const product4 = await Product.create({
            name: 'Chaussures-de-randonnee',
            description: 'Really nice shoes.',
            price: 60,
            category: 'Clothe',
            brand: 'QUECHUA',
            imageUrl: 'https://contents.mediadecathlon.com/p2579131/k$5ef8e189f7d80c766b360ca9db4ded9f/sq/chaussures-de-randonnee-montagnetige-mid-impermeables-homme-mh100-noir.jpg?format=auto&f=2400x2400',
        });
        const product5 = await Product.create({
            name: 'basketball hoop',
            description: 'Really nice shoes.',
            price: 349,
            category: 'Equipment',
            brand: 'TARMAK',
            imageUrl: 'https://contents.mediadecathlon.com/p2635077/k$d186b8c931fff3cafa0a2f0042c93d37/sq/panier-de-basket-sur-pied-reglage-facile-240m-a-305m-b700-pro.jpg?format=auto&f=2400x2400',
        });
        const product6 = await Product.create({
            name: 'Water Bottle',
            description: 'Insulated stainless steel water bottle.',
            price: 19.99,
            category: 'Equipment',
            brand: 'Hydro Flask',
            imageUrl: 'https://m.media-amazon.com/images/I/61M0AXkvCWL._AC_SX679_.jpg',
        });
        const product7 = await Product.create({
            name: 'Tennis Racket',
            description: 'Professional-grade tennis racket for competitive matches.',
            price: 179.99,
            category: 'Equipment',
            brand: 'Wilson',
            imageUrl: 'https://www.tennispro.fr/media/catalog/product/cache/1/thumbnail/1200x/9df78eab33525d08d6e5fb8d27136e95/w/r/wr079710u_1.jpg',
        });
        const product8 = await Product.create({
            name: 'Soccer Jersey',
            description: 'Team soccer jersey made with breathable fabric.',
            price: 79.99,
            category: 'Clothe',
            brand: 'Adidas',
            imageUrl: 'https://cdn1.espacefoot.fr/19493-large_default/FN8781101MaillotPsgExterieur202425.jpg',
        });
        const product9 = await Product.create({
            name: 'Swimming Goggles',
            description: 'Anti-fog swimming goggles with UV protection.',
            price: 24.99,
            category: 'Equipment',
            brand: 'Speedo',
            imageUrl: 'https://m.media-amazon.com/images/I/61A3KIR36LL._AC_SX679_.jpg',
        });
        const product10 = await Product.create({
            name: 'Cycling Helmet',
            description: 'Lightweight and ventilated cycling helmet.',
            price: 89.99,
            category: 'Equipment',
            brand: 'Giro',
            imageUrl: 'https://m.media-amazon.com/images/I/51SlOvzJ0nL._AC_SL1000_.jpg',
        });

        // Insert Stock
        await Stock.create({productId: product1.id, size: 'Standard', quantity: 0,});
        await Stock.create({productId: product2.id, size: 'Standard', quantity: 50,});
        await Stock.create({productId: product3.id, size: '42', quantity: 50,});
        await Stock.create({productId: product3.id, size: '40', quantity: 100,});

        // Insert Reviews
        await Review.create({userId: user2.id, productId: product1.id, rating: 5, comment: 'Great football, excellent grip and durability!',});
        await Review.create({userId: user3.id, productId: product1.id, rating: 3, comment: 'Bad :(',});
        await Review.create({userId: user4.id, productId: product1.id, rating: 2, comment: 'I hate it, give me my money back  !!!',});
        await Review.create({userId: user5.id, productId: product1.id, rating: 4, comment: 'Pretty good !',});
        await Review.create({userId: user6.id, productId: product1.id, rating: 5, comment: 'Pretty good !',});
        await Review.create({userId: user7.id, productId: product1.id, rating: 3, comment: '',});
        await Review.create({userId: user8.id, productId: product1.id, rating: 4, comment: 'Pretty good !',});
        await Review.create({userId: user9.id, productId: product1.id, rating: 4, comment: 'Pretty good !',});
        await Review.create({userId: user10.id, productId: product1.id, rating: 4, comment: 'Pretty good !',});

        // Insert Cart Items
        await CartItem.create({userId: user1.id, productId: product1.id, quantity: 2, size: 'Standard',});
        await CartItem.create({userId: user1.id, productId: product2.id, quantity: 1, size: 'Standard',});

        // Insert Orders
        const order1 = await Order.create({userId: user1.id, totalPrice: 81.97, shippingAddress: '123 Sports Street, Cityville, USA',});

        // Insert Order Items
        await OrderItem.create({orderId: order1.id, productId: product1.id, quantity: 2, size: 'Standard', price: 25.99,});
        await OrderItem.create({orderId: order1.id, productId: product2.id, quantity: 1, size: 'Standard', price: 30.99,});

        // Insert HelpTickets
        const ticket1 = await HelpTicket.create({userId: user1.id, subject: 'Delivery Issue', description: 'My order hasn’t arrived yet.',});

        // Insert HelpTicketResponses
        await HelpTicketResponse.create({ticketId: ticket1.id, userId: user2.id, response: 'We’re looking into the issue and will update you shortly.',});

        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting data:", error);
    }
})();