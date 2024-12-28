import { Router, Request, Response } from "express";
import CartItem from "../models/cartItem";
import User from "../models/user";
import Product from "../models/product";
import Stock from "../models/stock";

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
 *                 $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: User not found or cart is empty.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.get("/:userId/cart", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Retrieve cart items for the user
        const cartItems = await CartItem.findAll({ where: { userId } });
        if (!cartItems || cartItems.length===0) {
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
 *                type: object
 *                properties:
 *                  productId:
 *                    type: integer
 *                    example: 3
 *                    description: Unique identifier of the product to be added to the cart.
 *                  quantity:
 *                    type: integer
 *                    example: 2
 *                    description: Quantity of the product to add to the cart.
 *                  size:
 *                    type: string
 *                    example: "42"
 *                    description: Size of the product.
 *     responses:
 *       201:
 *         description: Item added to the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid input or missing required fields.
 *       404:
 *         description: User or product not found, or invalid size.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.post("/:userId/cart", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { productId, quantity, size } = req.body;

    try {
        // Validate input types
        if (!productId || !quantity || !size || typeof productId !== 'number' || typeof quantity !== 'number' || typeof size !== 'string') {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Check if the product exists
        const productExists = await Product.findByPk(productId);
        if (!productExists) {
            res.status(404).json({ error: "Product not found." });
            return;
        }

        // Check if the requested size is valid and in stock
        const stock = await Stock.findOne({ where: { productId, size } });
        if (!stock || stock.quantity < quantity) {
            res.status(404).json({ error: "Requested size is unavailable or insufficient stock." });
            return;
        }

        // Check if the product of the same size already exists in the cart
        const existingCartItem = await CartItem.findOne({ where: { userId, productId, size } });
        if (existingCartItem) {
            // Check if the updated quantity exceeds available stock
            if (existingCartItem.quantity + quantity> stock.quantity) {
                res.status(400).json({ error: "Insufficient stock for the requested quantity." });
                return;
            }
            existingCartItem.quantity += quantity;

            await existingCartItem.save();
            res.status(200).json(existingCartItem);
        } else {
            // Create a new cart item if it doesn't exist
            const cartItem = await CartItem.create({ userId, productId, quantity, size });
            res.status(201).json(cartItem);
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/cart/{cartItemId}:
 *   put:
 *     tags:
 *       - CartItems
 *     summary: Update the quantity of a cart item
 *     description: Modify the quantity of a cart item using its unique cart item ID. If the quantity is set to 0, the item will be removed from the cart.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *       - in: path
 *         name: cartItemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the cart item.
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
 *     responses:
 *       200:
 *         description: Cart item updated successfully or removed if quantity is 0.
 *       400:
 *         description: Invalid input or insufficient stock.
 *       404:
 *         description: User or cart item not found.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.put("/:userId/cart/:cartItemId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const cartItemId = parseInt(req.params.cartItemId, 10);
    const { quantity } = req.body;

    try {
        // Validate input
        if (!quantity || typeof quantity !== 'number' || quantity < 0) {
            res.status(400).json({ error: "Invalid input. Quantity must be a non-negative number." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Find the cart item by ID and userId
        const cartItem = await CartItem.findOne({ where: { id: cartItemId, userId } });
        if (!cartItem) {
            res.status(404).json({ error: "Cart item not found for the given user." })
            return;
        }

        // Remove the cart item if quantity is set to 0
        if (quantity === 0) {
            await cartItem.destroy();
            res.status(200).json({ message: "Cart item removed successfully." });
            return;
        }

        // Validate stock for the requested quantity
        const stock = await Stock.findOne({ where: { productId: cartItem.productId, size: cartItem.size } });
        if (!stock) {
            res.status(400).json({ error: "Stock information not found." });
            return;
        }
        if (stock.quantity < quantity) {
            res.status(400).json({ error: "Insufficient stock for the requested quantity." });
            return;
        }

        // Update the quantity
        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json(cartItem);
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/cart/{cartItemId}:
 *   delete:
 *     tags:
 *       - CartItems
 *     summary: Remove an item from a user's cart
 *     description: Delete a specific item from a user's cart using its unique cart item ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *       - in: path
 *         name: cartItemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the cart item to delete.
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 *       404:
 *         description: Cart item not found for the given user.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.delete("/:userId/cart/:cartItemId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const cartItemId = parseInt(req.params.cartItemId, 10);

    try {
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Find the cart item by its ID and the userId
        const cartItem = await CartItem.findOne({ where: { id: cartItemId, userId } });
        if (!cartItem) {
            res.status(404).json({ error: "Cart item not found for the given user." });
            return;
        }

        // Delete the cart item
        await cartItem.destroy();

        res.status(200).json({ message: "Cart item removed successfully." });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/cart:
 *   delete:
 *     tags:
 *       - CartItems
 *     summary: Clear all items from a user's cart
 *     description: Remove all items from the cart for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: All items removed from the cart successfully.
 *       404:
 *         description: No items found in the cart for the given user.
 *       500:
 *         description: Internal server error.
 */
cartItemRouter.delete("/:userId/cart", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        // Find all cart items for the user
        const cartItems = await CartItem.findAll({ where: { userId } });
        if (!cartItems.length) {
            res.status(404).json({ error: "No items found in the cart for the given user." });
            return;
        }

        // Delete all cart items for the user
        await CartItem.destroy({ where: { userId } });

        res.status(200).json({ message: "All items removed from the cart successfully." });
    } catch (error) {
        console.error("Error clearing the cart:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default cartItemRouter;
