import { Router, Request, Response } from "express";
import HelpTicketResponse from "../models/helpTicketResponse";

const helpTicketResponseRouter = Router();

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
helpTicketResponseRouter.get("/:ticketId/responses", async (req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId, 10);

    try {
        const responses = await HelpTicketResponse.findAll({ where: { ticketId } });
        if (!responses || responses.length === 0) {
            res.status(404).json({ error: "No responses found for this help ticket." });
            return;
        }
        res.status(200).json(responses);
    } catch (error) {
        console.error("Error fetching responses for help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
helpTicketResponseRouter.post("/:ticketId/responses/:userId", async (req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId, 10);
    const userId = parseInt(req.params.userId, 10);
    const { response } = req.body;

    try {
        if (!response) {
            res.status(400).json({ error: "Missing required field: response." });
            return;
        }

        const newResponse = await HelpTicketResponse.create({ userId, ticketId, response });
        res.status(201).json(newResponse);
    } catch (error) {
        console.error("Error adding response to help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default helpTicketResponseRouter;