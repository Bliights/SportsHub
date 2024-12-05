import { Router, Request, Response } from "express";
import OrderItem from "../models/orderItem";

const orderItemRouter = Router();

/**
 * @openapi
 * /api/orders/{orderId}/items:
 *   get:
 *     tags:
 *       - OrdersItems
 *     summary: Get all items in a specific order
 *     description: Retrieve all items in a specific order by order ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *     responses:
 *       200:
 *         description: Successfully retrieved order items.
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
 *                   price:
 *                     type: float
 *                     example: 29.99
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.get("/:orderId/items", async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);

    try {
        const orderItems = await OrderItem.findAll({ where: { orderId } });
        if (!orderItems || orderItems.length === 0) {
            res.status(404).json({ error: "No items found for this order." });
            return;
        }

        res.status(200).json(orderItems);
    } catch (error) {
        console.error("Error fetching order items:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/orders/{orderId}/items:
 *   post:
 *     tags:
 *       - OrdersItems
 *     summary: Add an item to an order
 *     description: Add a new item to an order.
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *             required:
 *               - productId
 *               - quantity
 *               - size
 *               - price
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
 *               price:
 *                 type: float
 *                 example: 29.99
 *     responses:
 *       201:
 *         description: Order item added successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.post("/:orderId/items", async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const { productId, quantity, size, price } = req.body;

    try {
        if (!productId || !quantity || !size || !price) {
            res.status(400).json({ error: "All fields (productId, quantity, size, price) are required." });
            return;
        }

        const newOrderItem = await OrderItem.create({ orderId, productId, quantity, size, price });
        res.status(201).json(newOrderItem);
    } catch (error) {
        console.error("Error adding order item:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/orders/{orderId}/products/{productId}/{size}:
 *   put:
 *     tags:
 *       - OrdersItems
 *     summary: Update an item in an order
 *     description: Update the details of an existing item in an order by product ID and size.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product in the order.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the product in the order.
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
 *         description: Order item updated successfully.
 *       404:
 *         description: Order item not found.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.put("/:orderId/products/:productId/:size", async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const productId = parseInt(req.params.productId, 10);
    const size = req.params.size;
    const { quantity } = req.body;

    try {
        const orderItem = await OrderItem.findOne({ where: { orderId, productId, size } });
        if (!orderItem) {
            res.status(404).json({ error: "Order item not found." });
            return;
        }

        await orderItem.update({ quantity });
        res.status(200).json(orderItem);
    } catch (error) {
        console.error("Error updating order item:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/orders/{orderId}/products/{productId}/{size}:
 *   delete:
 *     tags:
 *       - OrdersItems
 *     summary: Remove an item from an order
 *     description: Delete a specific item from an order by product ID and size.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the order.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product in the order.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the product in the order.
 *     responses:
 *       200:
 *         description: Order item removed successfully.
 *       404:
 *         description: Order item not found.
 *       500:
 *         description: Internal server error.
 */
orderItemRouter.delete("/:orderId/products/:productId/:size", async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const productId = parseInt(req.params.productId, 10);
    const size = req.params.size;

    try {
        const orderItem = await OrderItem.findOne({ where: { orderId, productId, size } });
        if (!orderItem) {
            res.status(404).json({ error: "Order item not found." });
            return;
        }

        await orderItem.destroy();
        res.status(200).json({ message: "Order item removed successfully." });
    } catch (error) {
        console.error("Error deleting order item:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default orderItemRouter;