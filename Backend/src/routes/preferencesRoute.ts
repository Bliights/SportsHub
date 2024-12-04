import { Router, Request, Response } from "express";
import Preferences from "../models/preferences";
import User from "../models/user";

const preferencesRouter = Router();

/**
 * @openapi
 * /api/preferences:
 *   get:
 *     summary: Get all preferences
 *     description: Retrieve a list of all user preferences.
 *     responses:
 *       200:
 *         description: List of user preferences.
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
 *                   receiveNotification:
 *                     type: boolean
 *                     example: true
 *                   theme:
 *                     type: string
 *                     example: "dark"
 *                   newsLetter:
 *                     type: boolean
 *                     example: false
 *       500:
 *         description: Internal server error.
 */
preferencesRouter.get("/", async (req: Request, res: Response) => {
    try {
        const preferences = await Preferences.findAll();
        res.status(200).json(preferences);
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/preferences/{userId}:
 *   get:
 *     summary: Get user preferences
 *     description: Retrieve the preferences of a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully.
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
 *         description: Preferences not found.
 *       500:
 *         description: Internal server error.
 */
preferencesRouter.get("/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const preferences = await Preferences.findOne({ where: { userId } });
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
 * /api/preferences:
 *   post:
 *     summary: Create user preferences
 *     description: Create preferences for a specific user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
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
 *         description: Preferences created successfully.
 *       400:
 *         description: Invalid request or missing required fields.
 *       500:
 *         description: Internal server error.
 */
preferencesRouter.post("/", async (req: Request, res: Response) => {
    const { userId, receiveNotification, theme, newsLetter } = req.body;

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
        const existingPreferences = await Preferences.findOne({ where: { userId } });
        if (existingPreferences) {
            res.status(409).json({ error: "Preferences already exist for this user." });
            return;
        }
        const preferences = await Preferences.create({ userId, receiveNotification, theme, newsLetter });
        res.status(201).json(preferences);
    } catch (error) {
        console.error("Error creating preferences:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/preferences/{userId}:
 *   put:
 *     summary: Update user preferences
 *     description: Update the preferences for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
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
 *         description: Preferences updated successfully.
 *       404:
 *         description: Preferences not found.
 *       500:
 *         description: Internal server error.
 */
preferencesRouter.put("/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { receiveNotification, theme, newsLetter } = req.body;

    try {
        const preferences = await Preferences.findOne({ where: { userId } });
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
 * /api/preferences/{userId}:
 *   delete:
 *     summary: Delete user preferences
 *     description: Delete the preferences for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: Preferences deleted successfully.
 *       404:
 *         description: Preferences not found.
 *       500:
 *         description: Internal server error.
 */
preferencesRouter.delete("/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const preferences = await Preferences.findOne({ where: { userId } });
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

export default preferencesRouter;