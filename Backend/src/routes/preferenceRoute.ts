import { Router, Request, Response } from "express";
import Preference from "../models/preference";
import User from "../models/user";

const preferenceRouter = Router();

/**
 * @openapi
 * /api/users/{userId}/preferences:
 *   get:
 *     tags:
 *       - Preferences
 *     summary: Retrieve preferences of a specific user
 *     description: Fetch the preferences of a user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's preferences.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Preference'
 *       404:
 *         description: Preferences not found for the given user ID.
 *       500:
 *         description: Internal server error.
 */
preferenceRouter.get("/:userId/preferences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        const preferences = await Preference.findOne({ where: { userId } });
        if (!preferences) {
            res.status(404).json({ error: "Preferences not found." });
            return;
        }
        res.status(200).json(preferences);
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/preferences:
 *   put:
 *     tags:
 *       - Preferences
 *     summary: Update preferences for a user
 *     description: Modify the preferences of a specific user by their ID.
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
 *             properties:
 *               receiveNotification:
 *                 type: boolean
 *                 description: Whether the user wants to receive notifications.
 *                 example: true
 *               theme:
 *                 type: string
 *                 enum: ["light", "dark"]
 *                 description: The theme preference of the user.
 *                 example: "dark"
 *               newsLetter:
 *                 type: boolean
 *                 description: Whether the user wants to subscribe to newsletters.
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated the preferences.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Preference'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Preferences not found for the given user ID.
 *       500:
 *         description: Internal server error.
 */
preferenceRouter.put("/:userId/preferences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { receiveNotification, theme, newsLetter } = req.body;

    try {
        // Validate input types
        if ((receiveNotification !== undefined && typeof receiveNotification !== "boolean") ||
            (theme !== undefined && !["light", "dark"].includes(theme)) ||
            (newsLetter !== undefined && typeof newsLetter !== "boolean")
        ) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        const preferences = await Preference.findOne({ where: { userId } });
        if (!preferences) {
            res.status(404).json({ error: "Preferences not found." });
            return;
        }
        // Update only the fields that are provided in the request
        const fieldsToUpdate: Partial<{ receiveNotification: boolean; theme: "light" | "dark"; newsLetter: boolean; }> = {};
        if (receiveNotification !== undefined) fieldsToUpdate.receiveNotification = receiveNotification;
        if (theme !== undefined) fieldsToUpdate.theme = theme;
        if (newsLetter !== undefined) fieldsToUpdate.newsLetter = newsLetter;

        const updatedPreferences = await preferences.update(fieldsToUpdate);

        res.status(200).json(updatedPreferences);
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default preferenceRouter;