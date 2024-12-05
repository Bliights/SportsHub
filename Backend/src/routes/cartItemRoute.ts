import { Router, Request, Response } from "express";
import CartItem from "../models/cartItem";

const cartItemRouter = Router();

/**
 * @openapi
 * /api/users/{userId}/cart:
 *   get:
 *     tags:
 *       - CartItems
 *     summary: Get all items in a user's cart
 *     description: Retrieve all items currently in a specific user's cart.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items.
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
 *                   productId:
 *                     type: integer
 *                     example: 101
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   size:
 *                     type: string
 *                     example: "M"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
 *       404:
 *         description: User not found or cart is empty.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.get("/:userId/cart", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const cartItems = await CartItem.findAll({ where: { userId } });
        if (!cartItems.length) {
            res.status(404).json({ error: "No items found in the cart for this user." });
            return;
        }
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/cart:
 *   post:
 *     tags:
 *       - CartItems
 *     summary: Add an item to a user's cart
 *     description: Add a new item to the cart for a specific user.
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
 *             required:
 *               - productId
 *               - quantity
 *               - size
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               size:
 *                 type: string
 *                 example: "M"
 *     responses:
 *       201:
 *         description: Item added to the cart successfully.
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
 *                 productId:
 *                   type: integer
 *                   example: 101
 *                 quantity:
 *                   type: integer
 *                   example: 2
 *                 size:
 *                   type: string
 *                   example: "M"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-15T14:48:00.000Z"
 *       400:
 *         description: Invalid input or missing required fields.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.post("/:userId/cart", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { productId, quantity, size } = req.body;

    try {
        if (!productId || !quantity || !size) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        const cartItem = await CartItem.create({ userId, productId, quantity, size });
        res.status(201).json(cartItem);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/cart/{productId}:
 *   put:
 *     tags:
 *       - CartItems
 *     summary: Update an item in a user's cart
 *     description: Modify the details (e.g., quantity, size) of a product in the user's cart using the product ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product to update in the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *               size:
 *                 type: string
 *                 example: "L"
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 *       404:
 *         description: Product not found in the cart for the given user.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.put("/:userId/cart/:productId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const productId = parseInt(req.params.productId, 10);
    const { quantity, size } = req.body;

    try {
        const cartItem = await CartItem.findOne({ where: { userId, productId } });
        if (!cartItem) {
            res.status(404).json({ error: "Product not found in the cart for the given user." });
            return;
        }

        if (quantity !== undefined) cartItem.quantity = quantity;
        if (size !== undefined) cartItem.size = size;

        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/cart/{productId}:
 *   delete:
 *     tags:
 *       - CartItems
 *     summary: Remove an item from a user's cart
 *     description: Delete a specific product from a user's cart using its product ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product to delete from the cart.
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 *       404:
 *         description: Product not found in the cart for the given user.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.delete("/:userId/cart/:productId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const productId = parseInt(req.params.productId, 10);

    try {
        const cartItem = await CartItem.findOne({ where: { userId, productId } });
        if (!cartItem) {
            res.status(404).json({ error: "Product not found in the cart for the given user." });
            return;
        }

        await cartItem.destroy();
        res.status(200).json({ message: "Cart item removed successfully." });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default cartItemRouter;
