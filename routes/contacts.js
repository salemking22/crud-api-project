import express from 'express';
import Contact from '../models/contact.js';

const router = express.Router();

// Middleware to protect routes
function isLoggedIn(req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please login to access this resource.' });
}

// GET all contacts (public)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET contact by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new contact (protected)
router.post('/', isLoggedIn, async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    const newContact = new Contact({ firstName, lastName, email, phone });

    try {
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update contact by ID (protected)
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });
        res.json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE contact by ID (protected)
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
