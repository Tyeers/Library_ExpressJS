const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const authMiddleware = require("../middleware/authMiddleware");

// **GET ALL LOANS**
router.get("/", authMiddleware, async (req, res) => {
    try {
        const loans = await Loan.findAll();
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: "Error fetching loans", error: error.message });
    }
});

// **CREATE A NEW LOAN**
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { book_id, user_id, loan_date, return_date, status } = req.body;
        
        if (!book_id || !user_id || !loan_date || !return_date || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newLoan = await Loan.create({ book_id, user_id, loan_date, return_date, status });
        res.status(201).json({ message: "Loan created successfully", loan: newLoan });
    } catch (error) {
        res.status(500).json({ message: "Error creating loan", error: error.message });
    }
});

// **GET LOAN BY ID**
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const loan = await Loan.findByPk(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }
        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching loan", error: error.message });
    }
});

// **UPDATE LOAN**
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { return_date, status } = req.body;
        const loan = await Loan.findByPk(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        loan.return_date = return_date || loan.return_date;
        loan.status = status || loan.status;

        await loan.save();
        res.json({ message: "Loan updated successfully", loan });
    } catch (error) {
        res.status(500).json({ message: "Error updating loan", error: error.message });
    }
});

// **DELETE LOAN**
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const loan = await Loan.findByPk(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        await loan.destroy();
        res.json({ message: "Loan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting loan", error: error.message });
    }
});

module.exports = router;