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
var cartItem_1 = require("../models/cartItem");
var cartItemRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/users/{userId}/cart:
 *   get:
 *     tags:
 *       - CartItems
 *     summary: Get all items in a user's cart
 *     description: Retrieve all items currently in a specific user's cart.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items.
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
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
 *       404:
 *         description: User not found or cart is empty.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.get("/:userId/cart", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, cartItems, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cartItem_1.default.findAll({ where: { userId: userId } })];
            case 2:
                cartItems = _a.sent();
                if (!cartItems.length) {
                    res.status(404).json({ error: "No items found in the cart for this user." });
                    return [2 /*return*/];
                }
                res.status(200).json(cartItems);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching cart items:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/cart:
 *   post:
 *     tags:
 *       - CartItems
 *     summary: Add an item to a user's cart
 *     description: Add a new item to the cart for a specific user.
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
 *             required:
 *               - productId
 *               - quantity
 *               - size
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
 *     responses:
 *       201:
 *         description: Item added to the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 productId:
 *                   type: integer
 *                   example: 101
 *                 quantity:
 *                   type: integer
 *                   example: 2
 *                 size:
 *                   type: string
 *                   example: "M"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-15T14:48:00.000Z"
 *       400:
 *         description: Invalid input or missing required fields.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.post("/:userId/cart", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, productId, quantity, size, cartItem, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                _a = req.body, productId = _a.productId, quantity = _a.quantity, size = _a.size;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!productId || !quantity || !size) {
                    res.status(400).json({ error: "Mandatory fields are missing or invalid." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, cartItem_1.default.create({ userId: userId, productId: productId, quantity: quantity, size: size })];
            case 2:
                cartItem = _b.sent();
                res.status(201).json(cartItem);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Error adding item to cart:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/cart/{productId}:
 *   put:
 *     tags:
 *       - CartItems
 *     summary: Update an item in a user's cart
 *     description: Modify the details (e.g., quantity, size) of a product in the user's cart using the product ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product to update in the cart.
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
 *               size:
 *                 type: string
 *                 example: "L"
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 *       404:
 *         description: Product not found in the cart for the given user.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.put("/:userId/cart/:productId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId, _a, quantity, size, cartItem, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                productId = parseInt(req.params.productId, 10);
                _a = req.body, quantity = _a.quantity, size = _a.size;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, cartItem_1.default.findOne({ where: { userId: userId, productId: productId } })];
            case 2:
                cartItem = _b.sent();
                if (!cartItem) {
                    res.status(404).json({ error: "Product not found in the cart for the given user." });
                    return [2 /*return*/];
                }
                if (quantity !== undefined)
                    cartItem.quantity = quantity;
                if (size !== undefined)
                    cartItem.size = size;
                return [4 /*yield*/, cartItem.save()];
            case 3:
                _b.sent();
                res.status(200).json(cartItem);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.error("Error updating cart item:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/cart/{productId}:
 *   delete:
 *     tags:
 *       - CartItems
 *     summary: Remove an item from a user's cart
 *     description: Delete a specific product from a user's cart using its product ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product to delete from the cart.
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 *       404:
 *         description: Product not found in the cart for the given user.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.delete("/:userId/cart/:productId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId, cartItem, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                productId = parseInt(req.params.productId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, cartItem_1.default.findOne({ where: { userId: userId, productId: productId } })];
            case 2:
                cartItem = _a.sent();
                if (!cartItem) {
                    res.status(404).json({ error: "Product not found in the cart for the given user." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, cartItem.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Cart item removed successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error deleting cart item:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = cartItemRouter;
