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
                description: "Operations related to help tickets repsponses"
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
    },
    apis: [ "./routes/**/*.ts"],
}
const swaggerDoc = swaggerJsDoc(swaggerOptions);

export default swaggerDoc;