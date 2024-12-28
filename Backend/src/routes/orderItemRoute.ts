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
 *     description: Retrieve all items associated with a specific order using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique identifier of the order.
 *     responses:
 *       200:
 *         description: Successfully retrieved order items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: No items found for this order or the order does not exist.
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

export default orderItemRouter;