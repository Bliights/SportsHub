import { Router, Request, Response } from "express";
import Review from "../models/review";
import Product from "../models/product";
import User from "../models/user";

const reviewRouter = Router();

/**
 * @openapi
 * /api/products/{productId}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a specific product
 *     description: Retrieve all reviews for a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found for this product.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.get("/products/:productId/reviews", async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const reviews = await Review.findAll({ where: { productId } });
        if (!reviews || reviews.length === 0) {
            res.status(404).json({ error: "No reviews found for this product." });
            return;
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews submitted by a specific user
 *     description: Retrieve all reviews submitted by a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: User has not submitted any reviews.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.get("/users/:userId/reviews", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const reviews = await Review.findAll({ where: { userId } });
        if (!reviews || reviews.length === 0) {
            res.status(404).json({ error: "No reviews found for this user." });
            return;
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/users/{userId}/products/{productId}/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Add a new review for a product
 *     description: Submit a new review for a specific product by a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the user submitting the review.
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the product being reviewed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Rating given to the product. Must be between 1 and 5.
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Review comment for the product.
 *                 example: "Amazing product, would buy again!"
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input data or duplicate review.
 *       404:
 *         description: Product or user not found.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.post("/users/:userId/products/:productId/reviews", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const productId = parseInt(req.params.productId, 10);
    const { rating, comment } = req.body;

    try {
        // Validate input types
        if (!rating || !comment || typeof rating !== 'number' || rating < 1 || rating > 5 || typeof comment !== 'string' ) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        // Check if the product exists
        const existingProduct = await Product.findByPk(productId);
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found." });
            return;
        }

        // Check if the user exists
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({ where: { userId, productId } });
        if (existingReview) {
            res.status(400).json({ error: "User has already reviewed this product." });
            return;
        }

        const newReview = await Review.create({ userId, productId, rating, comment });
        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update a review by its ID
 *     description: Modify the details of an existing review.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the review.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Rating of the review. Must be between 1 and 5.
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Updated comment for the review.
 *                 example: "Updated comment"
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.put("/reviews/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { rating, comment } = req.body;

    try {
        // Validate input types
        if (
            (rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 5 )) || (comment !== undefined && typeof comment !== "string")
        ) {
            res.status(400).json({ error: "Mandatory fields are missing or invalid." });
            return;
        }

        const review = await Review.findByPk(id);
        if (!review) {
            res.status(404).json({ error: "Review not found." });
            return;
        }

        // Update only the provided fields
        const fieldsToUpdate: Partial<{ rating: number; comment: string }> = {};

        if (rating !== undefined) fieldsToUpdate.rating = rating;
        if (comment !== undefined) fieldsToUpdate.comment = comment;

        await review.update(fieldsToUpdate);
        res.status(200).json(review);
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review by its ID
 *     description: Remove a specific review by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unique identifier of the review.
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.delete("/reviews/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    try {
        const review = await Review.findByPk(id);
        if (!review) {
            res.status(404).json({ error: "Review not found." });
            return;
        }

        await review.destroy();
        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default reviewRouter;