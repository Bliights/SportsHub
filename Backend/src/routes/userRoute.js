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
var user_1 = require("../models/user");
var userRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: List of users.
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
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   role:
 *                     type: string
 *                     example: "customer"
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.default.findAll()];
            case 1:
                users = _a.sent();
                res.status(200).json(users);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching users:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   example: "customer"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_1.default.findByPk(userId)];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ error: "User not found." });
                    return [2 /*return*/];
                }
                res.status(200).json(user);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error fetching user:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Add a new user to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               email:
 *                 type: string
 *                 example: "jane.smith@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               role:
 *                 type: string
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: User created successfully.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, role, existingUser, newUser, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, role = _a.role;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (!name || !email || !password || !role) {
                    res.status(400).json({
                        error: "Mandatory fields are missing or invalid."
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user_1.default.findOne({ where: { email: email } })];
            case 2:
                existingUser = _b.sent();
                if (existingUser) {
                    res.status(409).json({ error: "A user with this email already exists." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user_1.default.create({ name: name, email: email, password: password, role: role })];
            case 3:
                newUser = _b.sent();
                res.status(201).json(newUser);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.error("Error creating user:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Update the details of an existing user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               email:
 *                 type: string
 *                 example: "jane.smith@example.com"
 *               password:
 *                 type: string
 *                 example: "newsecurepassword"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name, email, password, role, user, fieldsToUpdate, updatedUser, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = parseInt(req.params.id, 10);
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, role = _a.role;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_1.default.findByPk(userId)];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(404).json({ error: "User not found." });
                    return [2 /*return*/];
                }
                fieldsToUpdate = {};
                if (name !== undefined)
                    fieldsToUpdate.name = name;
                if (email !== undefined)
                    fieldsToUpdate.email = email;
                if (password !== undefined)
                    fieldsToUpdate.password = password;
                if (role !== undefined)
                    fieldsToUpdate.role = role;
                return [4 /*yield*/, user.update(fieldsToUpdate)];
            case 3:
                updatedUser = _b.sent();
                res.status(200).json(updatedUser);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error("Error updating user:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Remove a user from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_1.default.findByPk(userId)];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ error: "User not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "User deleted successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error deleting user:", error_5);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = userRouter;
