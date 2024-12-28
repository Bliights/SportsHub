import { Router, Request, Response } from "express";
import HelpTicketResponse from "../models/helpTicketResponse";
import User from "../models/user";
import HelpTicket from "../models/helpTicket";

const helpTicketResponseRouter = Router();

/**
 * @openapi
 * /api/help-tickets/{ticketId}/responses:
 *   get:
 *     tags:
 *       - HelpTicketsResponses
 *     summary: Retrieve all responses for a specific help ticket
 *     description: Fetch all responses associated with a given help ticket by its ID.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the help ticket.
 *     responses:
 *       200:
 *         description: Successfully retrieved all responses for the specified help ticket.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HelpTicketResponse'
 *       404:
 *         description: No responses found for the specified help ticket.
 *       500:
 *         description: Internal server error.
 */
helpTicketResponseRouter.get("/:ticketId/responses", async (req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId, 10);

    try {
        // Fetch the help ticket response
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
 *     description: Submit a response to an existing help ticket by specifying the user ID and ticket ID in the URL.
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
 *                 description: The content of the response to be added to the help ticket.
 *                 example: "Thank you for your patience. We are working on resolving the issue."
 *     responses:
 *       201:
 *         description: Response added to the help ticket successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpTicketResponse'
 *       400:
 *         description: Invalid input or missing required field(s).
 *       404:
 *         description: Help ticket or user not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketResponseRouter.post("/:ticketId/responses/:userId", async (req: Request, res: Response) => {
    const ticketId = parseInt(req.params.ticketId, 10);
    const userId = parseInt(req.params.userId, 10);
    const { response } = req.body;

    try {
        // Validate input
        if (!response || typeof response !== 'string') {
            res.status(400).json({ error: "Missing required field: response." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Check if the ticket exists
        const ticketExists = await HelpTicket.findByPk(ticketId);
        if (!ticketExists) {
            res.status(404).json({ error: "Ticket not found." });
            return;
        }

        // Create response
        const newResponse = await HelpTicketResponse.create({ userId, ticketId, response });
        ticketExists.updatedAt = new Date();
        await ticketExists.save();

        res.status(201).json(newResponse);
    } catch (error) {
        console.error("Error adding response to help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default helpTicketResponseRouter;