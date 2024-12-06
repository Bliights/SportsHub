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
var helpTicket_1 = require("../models/helpTicket");
var user_1 = require("../models/user");
var helpTicketRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/help-tickets:
 *   get:
 *     tags:
 *       - HelpTickets
 *     summary: Retrieve all help tickets
 *     description: Get a list of all help tickets in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of help tickets.
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
 *                     example: 1
 *                   subject:
 *                     type: string
 *                     example: "Delivery Issue"
 *                   description:
 *                     type: string
 *                     example: "My order hasn’t arrived yet."
 *                   status:
 *                     type: string
 *                     example: "open"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
 *                   closedAt:
 *                     type: string
 *                     format: date-time
 *                     example: null
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.get("/help-tickets", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tickets, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, helpTicket_1.default.findAll()];
            case 1:
                tickets = _a.sent();
                res.status(200).json(tickets);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching help tickets:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/help-tickets:
 *   get:
 *     tags:
 *       - HelpTickets
 *     summary: Retrieve help tickets of a specific user
 *     description: Fetch all help tickets submitted by a specific user identified by userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved help tickets for the user.
 *       404:
 *         description: User not found or no help tickets exist.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.get("/users/:userId/help-tickets", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, tickets, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
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
                return [4 /*yield*/, helpTicket_1.default.findAll({ where: { userId: userId } })];
            case 3:
                tickets = _a.sent();
                res.status(200).json(tickets);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error("Error fetching user help tickets:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/help-tickets/{id}:
 *   get:
 *     tags:
 *       - HelpTickets
 *     summary: Retrieve details of a specific help ticket
 *     description: Fetch details of a specific help ticket by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the help ticket.
 *     responses:
 *       200:
 *         description: Successfully retrieved the help ticket.
 *       404:
 *         description: Help ticket not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.get("/help-tickets/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, ticket, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, helpTicket_1.default.findByPk(id)];
            case 2:
                ticket = _a.sent();
                if (!ticket) {
                    res.status(404).json({ error: "Help ticket not found." });
                    return [2 /*return*/];
                }
                res.status(200).json(ticket);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching help ticket:", error_3);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/users/{userId}/help-tickets:
 *   post:
 *     tags:
 *       - HelpTickets
 *     summary: Create a new help ticket for a user
 *     description: Submit a new help ticket to the system for a specific user identified by their userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique identifier of the user submitting the help ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *             properties:
 *               subject:
 *                 type: string
 *                 description: The subject of the help ticket.
 *                 example: "Delivery Issue"
 *               description:
 *                 type: string
 *                 description: A detailed description of the issue or request.
 *                 example: "My order hasn’t arrived yet."
 *     responses:
 *       201:
 *         description: Successfully created the preferences.
 *       400:
 *         description: Invalid input or missing required fields.
 *       404:
 *         description: User not found.
 *       409:
 *         description: Preferences already exist for this user.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.post("/users/:userId/help-tickets", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, subject, description, ticket, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = parseInt(req.params.userId, 10);
                _a = req.body, subject = _a.subject, description = _a.description;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, helpTicket_1.default.create({ userId: userId, subject: subject, description: description })];
            case 2:
                ticket = _b.sent();
                res.status(201).json(ticket);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error("Error creating help ticket:", error_4);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/help-tickets/{id}:
 *   put:
 *     tags:
 *       - HelpTickets
 *     summary: Update an existing help ticket
 *     description: Update details of a help ticket by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the help ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "resolved"
 *     responses:
 *       200:
 *         description: Help ticket updated successfully.
 *       404:
 *         description: Help ticket not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.put("/help-tickets/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, status, ticket, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                status = req.body.status;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, helpTicket_1.default.findByPk(id)];
            case 2:
                ticket = _a.sent();
                if (!ticket) {
                    res.status(404).json({ error: "Help ticket not found." });
                    return [2 /*return*/];
                }
                ticket.status = status;
                return [4 /*yield*/, ticket.save()];
            case 3:
                _a.sent();
                res.status(200).json(ticket);
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error updating help ticket:", error_5);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/help-tickets/{id}:
 *   delete:
 *     tags:
 *       - HelpTickets
 *     summary: Delete a help ticket
 *     description: Remove a help ticket from the system by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the help ticket.
 *     responses:
 *       200:
 *         description: Help ticket deleted successfully.
 *       404:
 *         description: Help ticket not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.delete("/help-tickets/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, ticket, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, helpTicket_1.default.findByPk(id)];
            case 2:
                ticket = _a.sent();
                if (!ticket) {
                    res.status(404).json({ error: "Help ticket not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ticket.destroy()];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Help ticket deleted successfully." });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Error deleting help ticket:", error_6);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = helpTicketRouter;
