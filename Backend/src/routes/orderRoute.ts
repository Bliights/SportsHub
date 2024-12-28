import { Router, Request, Response } from "express";
import Order from "../models/order";
import User from "../models/user";
import CartItem from "../models/cartItem";
import OrderItem from "../models/orderItem";
import Product from "../models/product";
import Stock from "../models/stock";

const orderRouter = Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve all orders
 *     description: Fetch a list of all orders available in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/orders", async (req: Request, res: Response) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve orders for a specific user
 *     description: Fetch all orders placed by a specific user, identified by their user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No orders found for the specified user.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/users/:userId/orders", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Retrieve orders for the user
        const orders = await Order.findAll({ where: { userId } });
        if (!orders || orders.length === 0) {
            res.status(404).json({ error: "No orders found for this user." });
            return;
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve details of a specific order
 *     description: Fetch detailed information about an order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     responses:
 *       200:
 *         description: Successfully retrieved order details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ error: "Order not found." });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order for a user
 *     description: Place a new order for a user by specifying their user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request or missing required fields.
 *       404:
 *         description: No items found in the user's cart.
 *       500:
 *         description: Internal server error.
 */
orderRouter.post("/users/:userId/orders", async (req: Request, res: Response) => {
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

        // Create new order
        const newOrder = await Order.create({ userId, totalPrice: 0, status: "pending" });
        let totalPrice = 0;

        // Process each cart item
        for (const cartItem of cartItems) {
            const product = await Product.findByPk(cartItem.productId);

            if (!product) {
                res.status(404).json({ error: "Product not found for cart item ID." });
                return;
            }

            // Check stock for the product and size
            const stock = await Stock.findOne({
                where: { productId: cartItem.productId, size: cartItem.size },
            });

            if (!stock || stock.quantity < cartItem.quantity) {
                res.status(400).json({
                    error: `Insufficient stock for product ID ${cartItem.productId}, size ${cartItem.size}.`,
                });
                return;
            }

            // Deduct quantity from stock
            stock.quantity -= cartItem.quantity;
            await stock.save();

            // Calculate total price
            totalPrice += product.price * cartItem.quantity;

            // Create order item
            await OrderItem.create({
                orderId: newOrder.id,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                size: cartItem.size,
                price: product.price,
            });
        }

        // Update the order's total price
        newOrder.totalPrice = totalPrice;
        await newOrder.save();

        // Destroy all user cart item
        await CartItem.destroy({ where: { userId } });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/orders/{id}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update an order
 *     description: Update the status of an order using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique identifier of the order to update.
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
 *                 enum: ["pending", "shipped", "delivered"]
 *                 description: The new status for the order.
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status or missing required fields.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.put("/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    try {
        // Validate input types
        if (!status || !["pending", "shipped", "delivered"].includes(status) ) {
            res.status(400).json({ error: "Status incorrect or missing" });
            return;
        }

        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ error: "Order not found." });
            return;
        }

        order.status = status;
        order.closedAt = status==="delivered" ? new Date() : null;

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/orders/{id}:
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Delete an order
 *     description: Remove a specific order from the system using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique identifier of the order to delete.
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.delete("/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ error: "Order not found." });
            return;
        }

        // Delete all order items associated with the order
        const deletedOrderItemsCount = await OrderItem.destroy({ where: { orderId: id } });

        await order.destroy();
        res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default orderRouter;