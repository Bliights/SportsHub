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
var review_1 = require("../models/review");
var reviewRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/products/{productId}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a specific product
 *     description: Retrieve all reviews for a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews.
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
 *                     example: 5
 *                   rating:
 *                     type: integer
 *                     example: 4
 *                   comment:
 *                     type: string
 *                     example: "Great product!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
 *       404:
 *         description: No reviews found for this product.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.get("/products/:productId/reviews", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, reviews, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = parseInt(req.params.productId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, review_1.default.findAll({ where: { productId: productId } })];
            case 2:
                reviews = _a.sent();
                if (!reviews || reviews.length === 0) {
                    res.status(404).json({ error: "No reviews found for this product." });
                    return [2 /*return*/];
                }
                res.status(200).json(reviews);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching reviews:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews submitted by a specific user
 *     description: Retrieve all reviews submitted by a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user reviews.
 *       404:
 *         description: User has not submitted any reviews.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.get("/users/:userId/reviews", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, reviews, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, review_1.default.findAll({ where: { userId: userId } })];
            case 2:
                reviews = _a.sent();
                if (!reviews || reviews.length === 0) {
                    res.status(404).json({ error: "No reviews found for this user." });
                    return [2 /*return*/];
                }
                res.status(200).json(reviews);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error fetching user reviews:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/products/{productId}/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Add a new review for a product
 *     description: Submit a new review for a specific product by a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user submitting the review.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product being reviewed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Amazing product, would buy again!"
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.post("/users/:userId/products/:productId/reviews", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId, _a, rating, comment, newReview, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                productId = parseInt(req.params.productId, 10);
                _a = req.body, rating = _a.rating, comment = _a.comment;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!rating) {
                    res.status(400).json({ error: "Rating is required." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, review_1.default.create({ userId: userId, productId: productId, rating: rating, comment: comment })];
            case 2:
                newReview = _b.sent();
                res.status(201).json(newReview);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error("Error creating review:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update a review by its ID
 *     description: Modify the details of an existing review.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the review.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Updated comment"
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.put("/reviews/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, rating, comment, review, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                _a = req.body, rating = _a.rating, comment = _a.comment;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, review_1.default.findByPk(id)];
            case 2:
                review = _b.sent();
                if (!review) {
                    res.status(404).json({ error: "Review not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, review.update({ rating: rating, comment: comment })];
            case 3:
                _b.sent();
                res.status(200).json(review);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error("Error updating review:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review by its ID
 *     description: Remove a specific review by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the review.
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.delete("/reviews/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, review, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, review_1.default.findByPk(id)];
            case 2:
                review = _a.sent();
                if (!review) {
                    res.status(404).json({ error: "Review not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, review.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Review deleted successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error deleting review:", error_5);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = reviewRouter;
