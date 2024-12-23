import { Router, Request, Response } from "express";
import Order from "../models/order";

const orderRouter = Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     description: Retrieve all orders in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders.
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
 *                     example: 101
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   totalPrice:
 *                     type: float
 *                     example: 129.99
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T14:48:00.000Z"
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
 *     summary: Get all orders for a specific user
 *     description: Retrieve all orders placed by a specific user.
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
 *       404:
 *         description: User has no orders.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get("/users/:userId/orders", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
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
 *     summary: Get details of a specific order
 *     description: Retrieve details of a specific order by its ID.
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
 *     summary: Place a new order for a user
 *     description: Create a new order for a specific user.
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
 *               totalPrice:
 *                 type: float
 *                 example: 129.99
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Internal server error.
 */
orderRouter.post("/users/:userId/orders", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const { totalPrice } = req.body;

    try {
        if (!totalPrice) {
            res.status(400).json({ error: "Total price is required." });
            return;
        }

        const newOrder = await Order.create({ userId, totalPrice, status: "pending" });
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
 *     description: Update details of a specific order (e.g., change status).
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderRouter.put("/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { status,closedAt, totalPrice } = req.body;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ error: "Order not found." });
            return;
        }

        order.status = status;
        order.closedAt=closedAt;
        order.totalPrice=totalPrice;
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
 *     summary: Cancel or delete an order
 *     description: Remove a specific order from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
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

        await order.destroy();
        res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default orderRouter;