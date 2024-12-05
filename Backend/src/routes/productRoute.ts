import { Router, Request, Response } from "express";
import Product from "../models/product";

const productRouter = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a list of all products
 *     description: Retrieve a list of all available products.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of products.
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
 *                   name:
 *                     type: string
 *                     example: "Football"
 *                   description:
 *                     type: string
 *                     example: "An official size football."
 *                   price:
 *                     type: float
 *                     example: 25.99
 *                   category:
 *                     type: string
 *                     example: "Sports"
 *                   brand:
 *                     type: string
 *                     example: "Nike"
 *                   imageUrl:
 *                     type: string
 *                     example: "https://example.com/image.jpg"
 *       500:
 *         description: Internal server error.
 */
productRouter.get("/", async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get details of a specific product
 *     description: Retrieve details of a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product details.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
productRouter.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Product not found." });
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add a new product
 *     description: Create a new product in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - brand
 *               - imageUrl
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Football"
 *               description:
 *                 type: string
 *                 example: "An official size football."
 *               price:
 *                 type: float
 *                 example: 25.99
 *               category:
 *                 type: string
 *                 example: "Sports"
 *               brand:
 *                 type: string
 *                 example: "Nike"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
productRouter.post("/", async (req: Request, res: Response) => {
    const { name, description, price, category, brand, imageUrl } = req.body;

    try {
        const newProduct = await Product.create({ name, description, price, category, brand, imageUrl });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product details
 *     description: Update details of an existing product.
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Football"
 *               description:
 *                 type: string
 *                 example: "An updated description for the football."
 *               price:
 *                 type: float
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 example: "Updated Category"
 *               brand:
 *                 type: string
 *                 example: "Updated Brand"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
productRouter.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { name, description, price, category, brand, imageUrl } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Product not found." });
            return;
        }

        await product.update({ name, description, price, category, brand, imageUrl });
        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     description: Remove a specific product from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
productRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Product not found." });
            return;
        }

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default productRouter;