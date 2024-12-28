import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "SportsHub",
            version: "0.1.0"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        tags: [
            {
                name: "CartItems",
                description: "Operations related to cart items"
            },
            {
                name: "HelpTickets",
                description: "Operations related to help tickets"
            },
            {
                name: "HelpTicketsResponses",
                description: "Operations related to help tickets reponses"
            },
            {
                name: "Orders",
                description: "Operations related to orders"
            },
            {
                name: "OrdersItems",
                description: "Operations related to orders items"
            },
            {
                name: "Preferences",
                description: "Operations related to preferences"
            },
            {
                name: "Products",
                description: "Operations related to products"
            },
            {
                name: "Reviews",
                description: "Operations related to reviews"
            },
            {
                name: "Stocks",
                description: "Operations related to stocks"
            },
            {
                name: "Users",
                description: "Operations related to users"
            },
        ],
        components: {
            schemas: {
                CartItem: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        productId: { type: "integer", example: 1 },
                        quantity: { type: "integer", example: 2 },
                        size: { type: "string", example: "M" },
                        createdAt: { type: "string", format: "date-time", example: "2023-06-15T16:00:00.000Z" },
                    },
                },
                HelpTicket: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        subject: { type: "string", example: "Delivery Issue" },
                        description: { type: "string", example: "My order hasn’t arrived yet." },
                        status: {
                            type: "string",
                            enum: ["open", "in_progress", "closed"],
                            example: "open",
                        },
                        createdAt: { type: "string", format: "date-time", example: "2023-06-15T14:48:00.000Z" },
                        updatedAt: { type: "string", format: "date-time", example: "2023-06-15T14:48:00.000Z" },
                        closedAt: { type: "string", format: "date-time", example: null },
                    },
                },
                HelpTicketResponse: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        ticketId: { type: "integer", example: 1 },
                        response: { type: "string", example: "We’re looking into the issue." },
                        createdAt: { type: "string", format: "date-time", example: "2023-06-15T15:00:00.000Z" },
                    },
                },
                Order: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        status: { type: "string", enum: ["pending", "shipped", "delivered"], example: "pending" },
                        totalPrice: { type: "number", format: "float", example: 119.98 },
                        createdAt: { type: "string", format: "date-time", example: "2023-06-15T17:00:00.000Z" },
                        closedAt: { type: "string", format: "date-time", example: null },
                    },
                },
                OrderItem: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        orderId: { type: "integer", example: 1 },
                        productId: { type: "integer", example: 1 },
                        quantity: { type: "integer", example: 1 },
                        size: { type: "string", example: "M" },
                        price: { type: "number", format: "float", example: 59.99 },
                    },
                },
                Preference: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        receiveNotification: { type: "boolean", example: true },
                        theme: { type: "string", enum: ["light", "dark"], example: "light" },
                        newsLetter: { type: "boolean", example: true },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Sports Shoes" },
                        description: { type: "string", example: "High-quality sports shoes for running." },
                        price: { type: "number", format: "float", example: 59.99 },
                        category: { type: "string", example: "Footwear" },
                        brand: { type: "string", example: "Nike" },
                        imageUrl: { type: "string", example: "http://example.com/image.jpg" },
                    },
                },
                Review: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        productId: { type: "integer", example: 1 },
                        rating: { type: "integer", example: 5, minimum: 1, maximum: 5 },
                        comment: { type: "string", example: "Great product!" },
                        createdAt: { type: "string", format: "date-time", example: "2023-06-15T18:00:00.000Z" },
                    },
                },
                Stock: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        productId: { type: "integer", example: 1 },
                        quantity: { type: "integer", example: 100 },
                        size: { type: "string", example: "M" },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "johndoe@example.com" },
                        password: { type: "string", example: "hashed_password" },
                        role: { type: "string", enum: ["customer", "admin"], example: "customer" },
                    },
                },
            }
        },
    },
    apis: [ "./routes/**/*.ts"],
}
const swaggerDoc = swaggerJsDoc(swaggerOptions);

export default swaggerDoc;