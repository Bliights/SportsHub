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
    },
    apis: [ "./routes/**/*.ts"],
}
const swaggerDoc = swaggerJsDoc(swaggerOptions);

export default swaggerDoc;