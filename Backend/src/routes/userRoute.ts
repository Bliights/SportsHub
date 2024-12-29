import { Router, Request, Response } from "express";
import User from "../models/user";
import Preference from "../models/preference";
import CartItem from "../models/cartItem";

const userRouter = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve all users
 *     description: Fetch a complete list of all users in the system, including their details.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: An error occurred while fetching the users.
 */
userRouter.get("/", async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
 *                 example: "Ema Smith"
 *               email:
 *                 type: string
 *                 example: "ema.smith@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               role:
 *                 type: string
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data.
 *       409:
 *         description: User with the provided email already exists.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/", async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        // Validate input
        if (!name || !email || !password || !role || typeof name !== 'string' || typeof email !== 'string'
            || typeof password !== 'string'|| !["customer", "admin"].includes(role)) {
            res.status(400).json({
                error: "Mandatory fields are missing or invalid."
            });
            return;
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: "A user with this email already exists." });
            return;
        }

        const newUser = await User.create({ name, email, password, role });

        // Create default preferences for the user
        await Preference.create({ userId: newUser.id, receiveNotification: true, theme: "light", newsLetter: true });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
 *                 example: "Ema Smith"
 *               email:
 *                 type: string
 *                 example: "ema.smith@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.put("/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    const { name, email, password, role } = req.body;

    try {
        // Validate input
        if ((name !== undefined && typeof name !== 'string') ||
            (email !== undefined && typeof email !== 'string') ||
            (password !== undefined && typeof password !== 'string') ||
            (role !== undefined && !["customer", "admin"].includes(role))
        ) {
            res.status(400).json({
                error: "Mandatory fields are missing or invalid."
            });
            return;
        }

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Check if new password is different from old password
        if (password && password === user.password) {
            res.status(400).json({ error: "New password must be different from the old password." });
            return;
        }

        // Update only the fields that are provided in the request
        const fieldsToUpdate: Partial<{ name: string; email: string; password: string; role: string }> = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (email !== undefined) fieldsToUpdate.email = email;
        if (password !== undefined) fieldsToUpdate.password = password;
        if (role !== undefined) fieldsToUpdate.role = role;

        const updatedUser = await user.update(fieldsToUpdate);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

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
userRouter.delete("/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Delete user preferences
        const deletedPreferencesCount = await Preference.destroy({ where: { userId } });

        // Delete cart of the user
        const deletedCartItemsCount = await CartItem.destroy({ where: { userId } });

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default userRouter;