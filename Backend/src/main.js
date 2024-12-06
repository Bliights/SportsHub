"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var swagger_ui_express_1 = require("swagger-ui-express");
var database_1 = require("./config/database");
var swagger_1 = require("./config/swagger");
var userRoute_1 = require("./routes/userRoute");
var preferenceRoute_1 = require("./routes/preferenceRoute");
var helpTicketRoute_1 = require("./routes/helpTicketRoute");
var cartItemRoute_1 = require("./routes/cartItemRoute");
var helpTicketResponseRoute_1 = require("./routes/helpTicketResponseRoute");
var orderRoute_1 = require("./routes/orderRoute");
var productRoute_1 = require("./routes/productRoute");
var reviewRoute_1 = require("./routes/reviewRoute");
var stockRoute_1 = require("./routes/stockRoute");
var orderItemRoute_1 = require("./routes/orderItemRoute");
var associations_1 = require("./models/associations");
var user_1 = require("./models/user");
var preference_1 = require("./models/preference");
var helpTicket_1 = require("./models/helpTicket");
var helpTicketResponse_1 = require("./models/helpTicketResponse");
var review_1 = require("./models/review");
var product_1 = require("./models/product");
var cartItem_1 = require("./models/cartItem");
var order_1 = require("./models/order");
var orderItem_1 = require("./models/orderItem");
var stock_1 = require("./models/stock");
(0, associations_1.default)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
// Swagger Documentation
var swaggerUiOptions = { swaggerOptions: { defaultModelsExpandDepth: -1, defaultModelExpandDepth: -1, showModels: false, }, };
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.get("/api-docs", swagger_ui_express_1.default.setup(swagger_1.default, swaggerUiOptions));
app.get("/swagger.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(swagger_1.default);
});
// Routes
app.use("/api/users", userRoute_1.default);
app.use("/api/users", preferenceRoute_1.default);
app.use("/api/users", cartItemRoute_1.default);
app.use("/api", reviewRoute_1.default);
app.use("/api", helpTicketRoute_1.default);
app.use("/api", orderRoute_1.default);
app.use("/api/help-tickets", helpTicketResponseRoute_1.default);
app.use("/api/products", productRoute_1.default);
app.use("/api/products", stockRoute_1.default);
app.use("/api/orders", orderItemRoute_1.default);
console.log("starting...");
app.listen(3000, function () {
    console.log("Ok, started port 3000, please open http://localhost:3000/api-docs");
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var user1, user2, product1, product2, order1, ticket1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 17, , 18]);
                // Synchronize the model with the database
                return [4 /*yield*/, database_1.default.sync({ force: true })];
            case 1:
                // Synchronize the model with the database
                _a.sent();
                return [4 /*yield*/, user_1.default.create({
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        password: '1234',
                        role: 'customer',
                    })];
            case 2:
                user1 = _a.sent();
                return [4 /*yield*/, user_1.default.create({
                        name: 'Jane Smith',
                        email: 'jane.smith@example.com',
                        password: '1234',
                        role: 'admin',
                    })];
            case 3:
                user2 = _a.sent();
                // Insert Preferences
                return [4 /*yield*/, preference_1.default.create({
                        userId: user1.id,
                    })];
            case 4:
                // Insert Preferences
                _a.sent();
                return [4 /*yield*/, product_1.default.create({
                        name: 'Football',
                        description: 'Official size and weight football for matches.',
                        price: 25.99,
                        category: 'Team Sports',
                        brand: 'Nike',
                        imageUrl: 'https://example.com/images/football.jpg',
                    })];
            case 5:
                product1 = _a.sent();
                return [4 /*yield*/, product_1.default.create({
                        name: 'Basketball',
                        description: 'Durable outdoor basketball.',
                        price: 30.99,
                        category: 'Team Sports',
                        brand: 'Spalding',
                        imageUrl: 'https://example.com/images/basketball.jpg',
                    })];
            case 6:
                product2 = _a.sent();
                // Insert Stock
                return [4 /*yield*/, stock_1.default.create({
                        productId: product1.id,
                        size: 'Standard',
                        quantity: 100,
                    })];
            case 7:
                // Insert Stock
                _a.sent();
                return [4 /*yield*/, stock_1.default.create({
                        productId: product2.id,
                        size: 'Standard',
                        quantity: 50,
                    })];
            case 8:
                _a.sent();
                // Insert Reviews
                return [4 /*yield*/, review_1.default.create({
                        userId: user1.id,
                        productId: product1.id,
                        rating: 5,
                        comment: 'Great football, excellent grip and durability!',
                    })];
            case 9:
                // Insert Reviews
                _a.sent();
                // Insert Cart Items
                return [4 /*yield*/, cartItem_1.default.create({
                        userId: user1.id,
                        productId: product1.id,
                        quantity: 2,
                        size: 'Standard',
                    })];
            case 10:
                // Insert Cart Items
                _a.sent();
                return [4 /*yield*/, cartItem_1.default.create({
                        userId: user1.id,
                        productId: product2.id,
                        quantity: 1,
                        size: 'Standard',
                    })];
            case 11:
                _a.sent();
                return [4 /*yield*/, order_1.default.create({
                        userId: user1.id,
                        totalPrice: 81.97,
                        shippingAddress: '123 Sports Street, Cityville, USA',
                    })];
            case 12:
                order1 = _a.sent();
                // Insert Order Items
                return [4 /*yield*/, orderItem_1.default.create({
                        orderId: order1.id,
                        productId: product1.id,
                        quantity: 2,
                        size: 'Standard',
                        price: 25.99,
                    })];
            case 13:
                // Insert Order Items
                _a.sent();
                return [4 /*yield*/, orderItem_1.default.create({
                        orderId: order1.id,
                        productId: product2.id,
                        quantity: 1,
                        size: 'Standard',
                        price: 30.99,
                    })];
            case 14:
                _a.sent();
                return [4 /*yield*/, helpTicket_1.default.create({
                        userId: user1.id,
                        subject: 'Delivery Issue',
                        description: 'My order hasn’t arrived yet.',
                    })];
            case 15:
                ticket1 = _a.sent();
                return [4 /*yield*/, helpTicketResponse_1.default.create({
                        ticketId: ticket1.id,
                        userId: user2.id,
                        response: 'We’re looking into the issue and will update you shortly.',
                    })];
            case 16:
                _a.sent();
                console.log("Data inserted successfully.");
                return [3 /*break*/, 18];
            case 17:
                error_1 = _a.sent();
                console.error("Error inserting data:", error_1);
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); })();
