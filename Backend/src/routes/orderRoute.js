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
var order_1 = require("../models/order");
var orderRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     description: Retrieve all orders in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 101
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   totalPrice:
 *                     type: float
 *                     example: 129.99
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/orders", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, order_1.default.findAll()];
            case 1:
                orders = _a.sent();
                res.status(200).json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching orders:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders for a specific user
 *     description: Retrieve all orders placed by a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders.
 *       404:
 *         description: User has no orders.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/users/:userId/orders", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, orders, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, order_1.default.findAll({ where: { userId: userId } })];
            case 2:
                orders = _a.sent();
                if (!orders || orders.length === 0) {
                    res.status(404).json({ error: "No orders found for this user." });
                    return [2 /*return*/];
                }
                res.status(200).json(orders);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error fetching user orders:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get details of a specific order
 *     description: Retrieve details of a specific order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     responses:
 *       200:
 *         description: Successfully retrieved order details.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/orders/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, order, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, order_1.default.findByPk(id)];
            case 2:
                order = _a.sent();
                if (!order) {
                    res.status(404).json({ error: "Order not found." });
                    return [2 /*return*/];
                }
                res.status(200).json(order);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching order:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Place a new order for a user
 *     description: Create a new order for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalPrice:
 *                 type: float
 *                 example: 129.99
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Internal server error.
 */
orderRouter.post("/users/:userId/orders", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, totalPrice, newOrder, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                totalPrice = req.body.totalPrice;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (!totalPrice) {
                    res.status(400).json({ error: "Total price is required." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order_1.default.create({ userId: userId, totalPrice: totalPrice, status: "pending" })];
            case 2:
                newOrder = _a.sent();
                res.status(201).json(newOrder);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error creating order:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/orders/{id}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update an order
 *     description: Update details of a specific order (e.g., change status).
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.put("/orders/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, status, order, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                status = req.body.status;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, order_1.default.findByPk(id)];
            case 2:
                order = _a.sent();
                if (!order) {
                    res.status(404).json({ error: "Order not found." });
                    return [2 /*return*/];
                }
                order.status = status;
                return [4 /*yield*/, order.save()];
            case 3:
                _a.sent();
                res.status(200).json(order);
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error updating order:", error_5);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/orders/{id}:
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Cancel or delete an order
 *     description: Remove a specific order from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.delete("/orders/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, order, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, order_1.default.findByPk(id)];
            case 2:
                order = _a.sent();
                if (!order) {
                    res.status(404).json({ error: "Order not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Order deleted successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Error deleting order:", error_6);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = orderRouter;
