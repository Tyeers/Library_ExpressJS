const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const authMiddleware = require("../middleware/authMiddleware");

// **GET ALL BOOKS**
router.get("/", async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// **CREATE A NEW BOOK (Protected)**
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("Decoded user:", req.user); // Debugging
        
        const { title, writer, category_id, publisher, year } = req.body;
        const user_id = req.user.userId; // Ambil user_id dari token

        if (!user_id) {
            return res.status(403).json({ message: "Access denied. User ID missing." });
        }

        if (!title || !writer || !category_id || !publisher || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newBook = await Book.create({ title, writer, category_id, publisher, year, user_id });
        res.status(201).json({ message: "Book created successfully", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Error creating book", error: error.message });
    }
});

// **GET BOOK BY ID**
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book", error: error.message });
    }
});

// **UPDATE BOOK (Protected)**
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, writer, category_id, publisher, year } = req.body;
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Pastikan user yang login hanya bisa mengedit buku miliknya
        if (book.user_id !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to edit this book" });
        }

        book.title = title || book.title;
        book.writer = writer || book.writer;
        book.category_id = category_id || book.category_id;
        book.publisher = publisher || book.publisher;
        book.year = year || book.year;

        await book.save();
        res.json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Error updating book", error: error.message });
    }
});

// **DELETE BOOK (Protected)**
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Pastikan hanya pemilik buku yang bisa menghapusnya
        if (book.user_id !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this book" });
        }

        await book.destroy();
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book", error: error.message });
    }
});

module.exports = router;
