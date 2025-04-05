const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');

// Get all documents
router.get('/', authMiddleware, async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user.id });
        res.json(documents);
    } catch (err) {
        console.error('Error fetching documents:', err.message);
        res.status(500).send('Server error');
    }
});

// Get a document by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).send('Document not found');
        res.json(document);
    } catch (err) {
        console.error('Error fetching document:', err.message);
        res.status(500).send('Server error');
    }
});

// Create a new document
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newDocument = new Document({ title, content, user: req.user.id });
        const document = await newDocument.save();
        res.json(document);
    } catch (err) {
        console.error('Error creating document:', err.message);
        res.status(500).send('Server error');
    }
});

// Update a document
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!document) return res.status(404).send('Document not found');
        res.json(document);
    } catch (err) {
        console.error('Error updating document:', err.message);
        res.status(500).send('Server error');
    }
});

// Delete a document
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) return res.status(404).send('Document not found');
        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error('Error deleting document:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
