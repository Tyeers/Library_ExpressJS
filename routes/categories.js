// File: routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // Get category by ID
    router.get('/:id', async (req, res) => {
    try {
        const category = await Category.getById(req.params.id);
        if (category) {
        res.json(category);
        } else {
        res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // Create new category
    router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const id = await Category.create(name, description);
        res.status(201).json({ id, name, description });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // Update category
    router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const success = await Category.update(req.params.id, name, description);
        if (success) {
        res.json({ message: 'Category updated successfully' });
        } else {
        res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

    // Delete category
    router.delete('/:id', async (req, res) => {
    try {
        const success = await Category.delete(req.params.id);
        if (success) {
        res.json({ message: 'Category deleted successfully' });
        } else {
        res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;