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
var stock_1 = require("../models/stock");
var stockRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/products/{productId}/stock:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get stock details for a specific product
 *     description: Retrieve stock details for a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved stock details.
 *       404:
 *         description: Stock not found for this product.
 *       500:
 *         description: Internal server error.
 */
stockRouter.get("/:productId/stock", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, stock, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, stock_1.default.findAll({ where: { productId: productId } })];
            case 2:
                stock = _a.sent();
                if (!stock || stock.length === 0) {
                    res.status(404).json({ error: "Stock not found for this product." });
                    return [2 /*return*/];
                }
                res.status(200).json(stock);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching stock:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/products/{productId}/stock/sizes:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get all available sizes for a product
 *     description: Retrieve a list of all available sizes for a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved available sizes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "M"
 *       404:
 *         description: No sizes found for this product.
 *       500:
 *         description: Internal server error.
 */
stockRouter.get("/:productId/stock/sizes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, sizes, sizeList, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, stock_1.default.findAll({
                        where: { productId: productId },
                        attributes: ['size'],
                        group: ['size'], // Ensure unique sizes
                    })];
            case 2:
                sizes = _a.sent();
                if (!sizes || sizes.length === 0) {
                    res.status(404).json({ error: "No sizes found for this product." });
                    return [2 /*return*/];
                }
                sizeList = sizes.map(function (stock) { return stock.size; });
                res.status(200).json(sizeList);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error fetching sizes:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/products/{productId}/stock:
 *   post:
 *     tags:
 *       - Stocks
 *     summary: Add stock for a specific product
 *     description: Add stock details for a specific product and size.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - size
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               size:
 *                 type: string
 *                 example: "M"
 *     responses:
 *       201:
 *         description: Stock added successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
stockRouter.post("/:productId/stock", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, _a, quantity, size, newStock, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                _a = req.body, quantity = _a.quantity, size = _a.size;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!quantity || !size) {
                    res.status(400).json({ error: "Quantity and size are required." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, stock_1.default.create({ productId: productId, quantity: quantity, size: size })];
            case 2:
                newStock = _b.sent();
                res.status(201).json(newStock);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error("Error adding stock:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/products/{productId}/stock/{size}:
 *   put:
 *     tags:
 *       - Stocks
 *     summary: Update stock details for a specific product and size
 *     description: Update the stock details of a specific product by product ID and size.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the stock entry to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Stock updated successfully.
 *       404:
 *         description: Stock entry not found.
 *       500:
 *         description: Internal server error.
 */
stockRouter.put("/:productId/stock/:size", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, size, quantity, stock, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                size = req.params.size;
                quantity = req.body.quantity;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, stock_1.default.findOne({ where: { productId: productId, size: size } })];
            case 2:
                stock = _a.sent();
                if (!stock) {
                    res.status(404).json({ error: "Stock entry not found for the specified product and size." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, stock.update({ quantity: quantity })];
            case 3:
                _a.sent();
                res.status(200).json(stock);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error updating stock:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/products/{productId}/stock/{size}:
 *   delete:
 *     tags:
 *       - Stocks
 *     summary: Remove stock for a specific size of a product
 *     description: Delete a stock entry for a specific product by product ID and size.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the stock entry to delete.
 *     responses:
 *       200:
 *         description: Stock entry deleted successfully.
 *       404:
 *         description: Stock entry not found.
 *       500:
 *         description: Internal server error.
 */
stockRouter.delete("/:productId/stock/:size", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, size, stock, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                size = req.params.size;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, stock_1.default.findOne({ where: { productId: productId, size: size } })];
            case 2:
                stock = _a.sent();
                if (!stock) {
                    res.status(404).json({ error: "Stock entry not found for the specified product and size." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, stock.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Stock entry deleted successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error deleting stock:", error_5);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/products/{productId}/stock:
 *   delete:
 *     tags:
 *       - Stocks
 *     summary: Remove all stock for a product
 *     description: Delete all stock entries for a specific product by its product ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: All stock entries deleted successfully.
 *       404:
 *         description: No stock entries found for the product.
 *       500:
 *         description: Internal server error.
 */
stockRouter.delete("/:productId/stock", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, stockEntries, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, stock_1.default.findAll({ where: { productId: productId } })];
            case 2:
                stockEntries = _a.sent();
                if (!stockEntries || stockEntries.length === 0) {
                    res.status(404).json({ error: "No stock entries found for this product." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, stock_1.default.destroy({ where: { productId: productId } })];
            case 3:
                _a.sent();
                res.status(200).json({ message: "All stock entries for the product have been deleted successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Error deleting all stock entries:", error_6);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = stockRouter;
