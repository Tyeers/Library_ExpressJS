const express = require("express");
const router = express.Router();
const Review = require("../models/Reviews");
const authMiddleware = require("../middleware/authMiddleware");

// **GET ALL REVIEWS**
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
});

// **CREATE A NEW REVIEW**
router.post("/:id", authMiddleware, async (req, res) => {
    try {
        const { book_id, user_id, rating, comment } = req.body;
        
        if (!book_id || !user_id || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newReview = await Review.create({ book_id, user_id, rating, comment });
        res.status(201).json({ message: "Review created successfully", review: newReview });
    } catch (error) {
        res.status(500).json({ message: "Error creating review", error: error.message });
    }
});

// **GET REVIEW BY ID**
router.get("/:id", async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: "Error fetching review", error: error.message });
    }
});

// **GET REVIEWS BY BOOK ID**
router.get("/book/:book_id", authMiddleware, async (req, res) => {
    try {
        const { book_id } = req.params;

        const reviews = await Review.findAll({
            where: { book_id }
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this book" });
        }

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
});


// **UPDATE REVIEW**
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();
        res.json({ message: "Review updated successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error: error.message });
    }
});

// **DELETE REVIEW**
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await review.destroy();
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
});

module.exports = router;