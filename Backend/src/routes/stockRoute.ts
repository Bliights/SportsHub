import { Router, Request, Response } from "express";
import Stock from "../models/stock";
import Product from "../models/product";

const stockRouter = Router();

/**
 * @openapi
 * /api/products/{productId}/stock:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Retrieve stock details for a specific product
 *     description: Retrieve stock details for a specific product by its ID, including quantity and available sizes.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved stock details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stock'
 *       404:
 *         description: Stock not found for this product.
 *       500:
 *         description: Internal server error.
 */
stockRouter.get("/:productId/stock", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const stock = await Stock.findAll({ where: { productId } });
        if (!stock || stock.length === 0) {
            res.status(404).json({ error: "Stock not found for this product." });
            return;
        }
        res.status(200).json(stock);
    } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{productId}/stock/sizes:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get available sizes for a specific product
 *     description: Retrieve all available sizes for a product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved available sizes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "M"
 *       404:
 *         description: No sizes found for this product.
 *       500:
 *         description: Internal server error.
 */
stockRouter.get("/:productId/stock/sizes", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const sizes = await Stock.findAll({
            where: { productId },
            attributes: ['size'],
            group: ['size'], // Ensure unique sizes
        });

        if (!sizes || sizes.length === 0) {
            res.status(404).json({ error: "No sizes found for this product." });
            return;
        }

        // Extract sizes from the result
        const sizeList = sizes.map(stock => stock.size);
        res.status(200).json(sizeList);
    } catch (error) {
        console.error("Error fetching sizes:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{productId}/stock:
 *   post:
 *     tags:
 *       - Stocks
 *     summary: Add or update stock for a specific product
 *     description: Add stock for a specific product and size. If the size already exists, the quantity will be updated.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - size
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               size:
 *                 type: string
 *                 example: "M"
 *     responses:
 *       201:
 *         description: Stock added or updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
stockRouter.post("/:productId/stock", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);
    const { quantity, size } = req.body;

    try {
        if (quantity === undefined || !size || typeof quantity !== 'number' || typeof size !== 'string' ||quantity < 0) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        // Check if the product exists
        const productExists = await Product.findByPk(productId);
        if (!productExists) {
            res.status(404).json({ error: "Product not found." });
            return;
        }

        // Check if there is already a stock for the size
        const existingStock = await Stock.findOne({ where: { productId, size } });
        if (existingStock) {
            existingStock.quantity += quantity;
            await existingStock.save();

            res.status(201).json(existingStock);
        } else {
            const newStock = await Stock.create({ productId, quantity, size });
            res.status(201).json(newStock);
        }
    } catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{productId}/stock/{size}:
 *   put:
 *     tags:
 *       - Stocks
 *     summary: Update stock details for a specific product and size
 *     description: Update the stock details of a specific product by product ID and size.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the stock entry to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Stock updated successfully.
 *       404:
 *         description: Stock entry not found.
 *       500:
 *         description: Internal server error.
 */
stockRouter.put("/:productId/stock/:size", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);
    const size = req.params.size;
    const { quantity } = req.body;

    try {
        const stock = await Stock.findOne({ where: { productId, size } });
        if (!stock) {
            res.status(404).json({ error: "Stock entry not found for the specified product and size." });
            return;
        }

        await stock.update({ quantity });
        res.status(200).json(stock);
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{productId}/stock/{size}:
 *   delete:
 *     tags:
 *       - Stocks
 *     summary: Remove stock for a specific size of a product
 *     description: Delete a stock entry for a specific product by product ID and size.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         description: Size of the stock entry to delete.
 *     responses:
 *       200:
 *         description: Stock entry deleted successfully.
 *       404:
 *         description: Stock entry not found.
 *       500:
 *         description: Internal server error.
 */
stockRouter.delete("/:productId/stock/:size", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);
    const size = req.params.size;

    try {
        const stock = await Stock.findOne({ where: { productId, size } });
        if (!stock) {
            res.status(404).json({ error: "Stock entry not found for the specified product and size." });
            return;
        }

        await stock.destroy();
        res.status(200).json({ message: "Stock entry deleted successfully." });
    } catch (error) {
        console.error("Error deleting stock:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{productId}/stock:
 *   delete:
 *     tags:
 *       - Stocks
 *     summary: Remove all stock for a product
 *     description: Delete all stock entries for a specific product by its product ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: All stock entries deleted successfully.
 *       404:
 *         description: No stock entries found for the product.
 *       500:
 *         description: Internal server error.
 */
stockRouter.delete("/:productId/stock", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const stockEntries = await Stock.findAll({ where: { productId } });

        if (!stockEntries || stockEntries.length === 0) {
            res.status(404).json({ error: "No stock entries found for this product." });
            return;
        }

        await Stock.destroy({ where: { productId } });
        res.status(200).json({ message: "All stock entries for the product have been deleted successfully." });
    } catch (error) {
        console.error("Error deleting all stock entries:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default stockRouter;