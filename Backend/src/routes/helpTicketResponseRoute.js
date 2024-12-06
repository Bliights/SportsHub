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
var helpTicketResponse_1 = require("../models/helpTicketResponse");
var helpTicketResponseRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/help-tickets/{ticketId}/responses:
 *   get:
 *     tags:
 *       - HelpTicketsResponses
 *     summary: Get all responses for a specific help ticket
 *     description: Retrieve all responses associated with a specific help ticket.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the help ticket.
 *     responses:
 *       200:
 *         description: Successfully retrieved responses for the help ticket.
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
 *                   ticketId:
 *                     type: integer
 *                     example: 101
 *                   response:
 *                     type: string
 *                     example: "We are working on your request."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
 *       404:
 *         description: Help ticket not found or has no responses.
 *       500:
 *         description: Internal server error.
 */
helpTicketResponseRouter.get("/:ticketId/responses", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, responses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ticketId = parseInt(req.params.ticketId, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, helpTicketResponse_1.default.findAll({ where: { ticketId: ticketId } })];
            case 2:
                responses = _a.sent();
                if (!responses || responses.length === 0) {
                    res.status(404).json({ error: "No responses found for this help ticket." });
                    return [2 /*return*/];
                }
                res.status(200).json(responses);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching responses for help ticket:", error_1);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @openapi
 * /api/help-tickets/{ticketId}/responses/{userId}:
 *   post:
 *     tags:
 *       - HelpTicketsResponses
 *     summary: Add a response to a specific help ticket
 *     description: Submit a response to an existing help ticket, specifying the user in the URL.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the help ticket.
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user submitting the response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 description: The content of the response.
 *                 example: "Thank you for your patience. We are resolving the issue."
 *     responses:
 *       201:
 *         description: Response added to the help ticket successfully.
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
 *                 ticketId:
 *                   type: integer
 *                   example: 101
 *                 response:
 *                   type: string
 *                   example: "Thank you for your patience. We are resolving the issue."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-15T14:48:00.000Z"
 *       404:
 *         description: Help ticket not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketResponseRouter.post("/:ticketId/responses/:userId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, userId, response, newResponse, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ticketId = parseInt(req.params.ticketId, 10);
                userId = parseInt(req.params.userId, 10);
                response = req.body.response;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (!response) {
                    res.status(400).json({ error: "Missing required field: response." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, helpTicketResponse_1.default.create({ userId: userId, ticketId: ticketId, response: response })];
            case 2:
                newResponse = _a.sent();
                res.status(201).json(newResponse);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error adding response to help ticket:", error_2);
                res.status(500).json({ error: "Internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = helpTicketResponseRouter;
