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
var orderItem_1 = require("../models/orderItem");
var orderItemRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/orders/{orderId}/items:
 *   get:
 *     tags:
 *       - OrdersItems
 *     summary: Get all items in a specific order
 *     description: Retrieve all items in a specific order by order ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     responses:
 *       200:
 *         description: Successfully retrieved order items.
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
 *                   productId:
 *                     type: integer
 *                     example: 101
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   size:
 *                     type: string
 *                     example: "M"
 *                   price:
 *                     type: float
 *                     example: 29.99
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.get("/:orderId/items", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, orderItems, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = parseInt(req.params.orderId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, orderItem_1.default.findAll({ where: { orderId: orderId } })];
            case 2:
                orderItems = _a.sent();
                if (!orderItems || orderItems.length === 0) {
                    res.status(404).json({ error: "No items found for this order." });
                    return [2 /*return*/];
                }
                res.status(200).json(orderItems);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching order items:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/orders/{orderId}/items:
 *   post:
 *     tags:
 *       - OrdersItems
 *     summary: Add an item to an order
 *     description: Add a new item to an order.
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *             required:
 *               - productId
 *               - quantity
 *               - size
 *               - price
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               size:
 *                 type: string
 *                 example: "M"
 *               price:
 *                 type: float
 *                 example: 29.99
 *     responses:
 *       201:
 *         description: Order item added successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.post("/:orderId/items", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, _a, productId, quantity, size, price, newOrderItem, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                orderId = parseInt(req.params.orderId, 10);
                _a = req.body, productId = _a.productId, quantity = _a.quantity, size = _a.size, price = _a.price;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!productId || !quantity || !size || !price) {
                    res.status(400).json({ error: "All fields (productId, quantity, size, price) are required." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, orderItem_1.default.create({ orderId: orderId, productId: productId, quantity: quantity, size: size, price: price })];
            case 2:
                newOrderItem = _b.sent();
                res.status(201).json(newOrderItem);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Error adding order item:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/orders/{orderId}/products/{productId}/{size}:
 *   put:
 *     tags:
 *       - OrdersItems
 *     summary: Update an item in an order
 *     description: Update the details of an existing item in an order by product ID and size.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product in the order.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the product in the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Order item updated successfully.
 *       404:
 *         description: Order item not found.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.put("/:orderId/products/:productId/:size", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, productId, size, quantity, orderItem, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = parseInt(req.params.orderId, 10);
                productId = parseInt(req.params.productId, 10);
                size = req.params.size;
                quantity = req.body.quantity;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, orderItem_1.default.findOne({ where: { orderId: orderId, productId: productId, size: size } })];
            case 2:
                orderItem = _a.sent();
                if (!orderItem) {
                    res.status(404).json({ error: "Order item not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, orderItem.update({ quantity: quantity })];
            case 3:
                _a.sent();
                res.status(200).json(orderItem);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error("Error updating order item:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/orders/{orderId}/products/{productId}/{size}:
 *   delete:
 *     tags:
 *       - OrdersItems
 *     summary: Remove an item from an order
 *     description: Delete a specific item from an order by product ID and size.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product in the order.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the product in the order.
 *     responses:
 *       200:
 *         description: Order item removed successfully.
 *       404:
 *         description: Order item not found.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.delete("/:orderId/products/:productId/:size", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, productId, size, orderItem, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = parseInt(req.params.orderId, 10);
                productId = parseInt(req.params.productId, 10);
                size = req.params.size;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, orderItem_1.default.findOne({ where: { orderId: orderId, productId: productId, size: size } })];
            case 2:
                orderItem = _a.sent();
                if (!orderItem) {
                    res.status(404).json({ error: "Order item not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, orderItem.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Order item removed successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error deleting order item:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = orderItemRouter;
