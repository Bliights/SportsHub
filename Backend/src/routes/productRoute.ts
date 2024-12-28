import { Router, Request, Response } from "express";
import Product from "../models/product";
import Stock from "../models/stock";
import Review from "../models/review";
import CartItem from "../models/cartItem";

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
 *                 $ref: '#/components/schemas/Product'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *     description: Create a new product in the system. Ensures no duplicate product exists with the same name and brand.
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
 *                 description: Name of the product.
 *                 example: "Football"
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *                 example: "An official size football."
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the product.
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 description: Category of the product.
 *                 example: "Sports"
 *               brand:
 *                 type: string
 *                 description: Brand of the product.
 *                 example: "Adidas"
 *               imageUrl:
 *                 type: string
 *                 description: URL of the product's image.
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request data or duplicate product.
 *       500:
 *         description: Internal server error.
 */
productRouter.post("/", async (req: Request, res: Response) => {
    const { name, description, price, category, brand, imageUrl } = req.body;
    try {
        // Validate input types
        if (!name || !description || price === undefined || !category || !brand || !imageUrl
            ||typeof name !== 'string' || typeof description !== 'string' || typeof price !== 'number'
            || typeof category !== 'string' || typeof brand !== 'string' || typeof imageUrl  !== 'string' || price < 0) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        // Check if a product with the same name and brand already exists
        const existingProduct = await Product.findOne({ where: { name, brand } });
        if (existingProduct) {
            res.status(400).json({ error: "A product with the same name and brand already exists." });
            return;
        }

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
 *                 type: number
 *                 format: float
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
productRouter.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { name, description, price, category, brand, imageUrl } = req.body;

    try {
        // Validate input types
        if (
            (name !== undefined && typeof name !== "string") ||
            (description !== undefined && typeof description !== "string") ||
            (price !== undefined && typeof price !== "number") ||
            (category !== undefined && typeof category !== "string") ||
            (brand !== undefined && typeof brand !== "string") ||
            (imageUrl !== undefined && typeof imageUrl !== "string")
        ) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Product not found." });
            return;
        }

        // Update only the provided fields
        const fieldsToUpdate: Partial<{ name: string; description: string; price: number; category: string; brand: string;
            imageUrl: string;
        }> = {};

        if (name !== undefined) fieldsToUpdate.name = name;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (price !== undefined) fieldsToUpdate.price = price;
        if (category !== undefined) fieldsToUpdate.category = category;
        if (brand !== undefined) fieldsToUpdate.brand = brand;
        if (imageUrl !== undefined) fieldsToUpdate.imageUrl = imageUrl;

        await product.update(fieldsToUpdate);

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
 *     description: Remove a specific product from the system by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product to be deleted.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       400:
 *         description: Invalid product ID.
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

        // Delete all stock entries associated with the product
        const deletedStockCount = await Stock.destroy({ where: { productId: id } });

        // Delete all reviews associated with the product
        const deletedReviewCount = await Review.destroy({ where: { productId: id } });

        // Delete all cart items associated with the product
        const deletedCartItemCount = await CartItem.destroy({ where: { productId: id } });

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default productRouter;