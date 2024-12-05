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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 receiveNotification:
 *                   type: boolean
 *                   example: true
 *                 theme:
 *                   type: string
 *                   example: "dark"
 *                 newsLetter:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Preferences not found for the given user ID.
 *       500:
 *         description: Internal server error.
 */
preferenceRouter.get("/:userId/preferences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
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
 *   post:
 *     tags:
 *       - Preferences
 *     summary: Create preferences for a user
 *     description: Add a new set of preferences for a specific user.
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
 *                 example: true
 *               theme:
 *                 type: string
 *                 example: "dark"
 *               newsLetter:
 *                 type: boolean
 *                 example: true
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
preferenceRouter.post("/:userId/preferences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { receiveNotification, theme, newsLetter } = req.body;

    try {
        if (!userId || receiveNotification === undefined || !theme || newsLetter === undefined) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Check if preferences already exist for the user
        const existingPreferences = await Preference.findOne({ where: { userId } });
        if (existingPreferences) {
            res.status(409).json({ error: "Preferences already exist for this user." });
            return;
        }
        const preferences = await Preference.create({ userId, receiveNotification, theme, newsLetter });
        res.status(201).json(preferences);
    } catch (error) {
        console.error("Error creating preferences:", error);
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
 *                 example: true
 *               theme:
 *                 type: string
 *                 example: "dark"
 *               newsLetter:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated the preferences.
 *       404:
 *         description: Preferences not found for the given user ID.
 *       500:
 *         description: Internal server error.
 */
preferenceRouter.put("/:userId/preferences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { receiveNotification, theme, newsLetter } = req.body;

    try {
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

/**
 * @openapi
 * /api/users/{userId}/preferences:
 *   delete:
 *     tags:
 *       - Preferences
 *     summary: Delete preferences of a user
 *     description: Remove the preferences of a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully deleted the preferences.
 *       404:
 *         description: Preferences not found for the given user ID.
 *       500:
 *         description: Internal server error.
 */
preferenceRouter.delete("/:userId/preferences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const preferences = await Preference.findOne({ where: { userId } });
        if (!preferences) {
            res.status(404).json({ error: "Preferences not found." });
            return;
        }

        await preferences.destroy();
        res.status(200).json({ message: "Preferences deleted successfully." });
    } catch (error) {
        console.error("Error deleting preferences:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default preferenceRouter;