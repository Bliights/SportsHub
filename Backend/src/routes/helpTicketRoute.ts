import { Router, Request, Response } from "express";
import HelpTicket from "../models/helpTicket";
import User from "../models/user";
import HelpTicketResponse from "../models/helpTicketResponse";

const helpTicketRouter = Router();

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
 *                 $ref: '#/components/schemas/HelpTicket'
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.get("/help-tickets", async (req: Request, res: Response) => {
    try {
        const tickets = await HelpTicket.findAll();
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching help tickets:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HelpTicket'
 *       404:
 *         description: User not found or no help tickets exist for the user.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.get("/users/:userId/help-tickets", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Fetch help tickets for the user
        const tickets = await HelpTicket.findAll({ where: { userId } });
        if (!tickets || tickets.length===0) {
            res.status(404).json({ error: "No tickets found for this user." });
            return;
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching user help tickets:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpTicket'
 *       404:
 *         description: Help ticket not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.get("/help-tickets/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        // Fetch the help ticket by its ID
        const ticket = await HelpTicket.findByPk(id);
        if (!ticket) {
            res.status(404).json({ error: "Help ticket not found." });
            return;
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error("Error fetching help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
 *                 example: "Problem with ..."
 *                 description: The subject of the help ticket.
 *               description:
 *                 type: string
 *                 example: "I got a pb with ..."
 *                 description: A detailed description of the issue or request.
 *     responses:
 *       201:
 *         description: Help ticket created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpTicket'
 *       400:
 *         description: Invalid input or missing required fields.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.post("/users/:userId/help-tickets", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { subject, description } = req.body;

    try {
        // Validate input
        if (!subject || !description || typeof subject !== 'string' || typeof description !== 'string') {
            res.status(400).json({ error: "Missing required fields: 'subject' and 'description' are mandatory." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Create the help ticket
        const ticket = await HelpTicket.create({ userId, subject, description });

        res.status(201).json(ticket);
    } catch (error) {
        console.error("Error creating help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/help-tickets/{id}:
 *   put:
 *     tags:
 *       - HelpTickets
 *     summary: Update an existing help ticket
 *     description: Update details of a help ticket by its ID, such as its status.
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "in_progress"
 *                 description: The updated status of the help ticket.
 *     responses:
 *       200:
 *         description: Help ticket updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpTicket'
 *       400:
 *         description: Invalid input or missing required fields.
 *       404:
 *         description: Help ticket not found.
 *       500:
 *         description: Internal server error.
 */
helpTicketRouter.put("/help-tickets/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    try {
        // Validate input
        if (!status || !["open", "in_progress", "closed"].includes(status)) {
            res.status(400).json({
                error: "Invalid input. 'status' is required and must be one of 'open', 'in_progress', 'closed'.",
            });
            return;
        }

        // Find the help ticket by ID
        const ticket = await HelpTicket.findByPk(id);
        if (!ticket) {
            res.status(404).json({ error: "Help ticket not found." });
            return;
        }

        // Update the ticket status
        ticket.status = status;
        ticket.updatedAt = new Date();

        // Set closedAt for "resolved" or "closed" statuses
        ticket.closedAt = ["closed"].includes(status) ? new Date() : null;
        await ticket.save();

        res.status(200).json(ticket);
    } catch (error) {
        console.error("Error updating help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
helpTicketRouter.delete("/help-tickets/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    try {
        // Find the help ticket by its ID
        const ticket = await HelpTicket.findByPk(id);
        if (!ticket) {
            res.status(404).json({ error: "Help ticket not found." });
            return;
        }

        // Delete all responses associated with the help ticket
        const deletedResponsesCount = await HelpTicketResponse.destroy({ where: { ticketId: id } });

        // Delete the ticket from the database
        await ticket.destroy();

        res.status(200).json({ message: "Help ticket deleted successfully." });
    } catch (error) {
        console.error("Error deleting help ticket:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default helpTicketRouter;