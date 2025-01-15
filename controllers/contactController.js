const asyncHandler = require("express-async-handler");
const Contact = require('../models/contactModel'); // Ensure this path is correct
const User = require('../models/userModel'); // Ensure this is correctly imported if used

// Get all contacts
const getContacts = asyncHandler(async (req, res) => {
    try {
        console.log("Fetching contacts for user ID:", req.user.id);

        // Fetch all contacts associated with the user ID
        const contacts = await Contact.findAll({
            where: { user_id: req.user.id }
        });

        console.log("Contacts fetched:", JSON.stringify(contacts, null, 2));
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
    }
});

// Create a new contact
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400).json({ message: "All fields are mandatory!" });
        return;
    }
    try {
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id
        });

        res.status(201).json(contact);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Failed to create contact", error: error.message });
    }
});

// Get a single contact
const getContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            res.status(404).json({ message: "Contact not found" });
            return;
        }
        // Check if the logged-in user owns the contact
        if (contact.user_id.toString() !== req.user.id) {
            res.status(403).json({ message: "User doesn't have permission to view this contact" });
            return;
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ message: "Failed to fetch contact", error: error.message });
    }
});

// Update a contact
const updateContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            res.status(404).json({ message: "Contact not found" });
            return;
        }

        // Check if the logged-in user owns the contact
        if (contact.user_id.toString() !== req.user.id) {
            res.status(403).json({ message: "User doesn't have permission to update this contact" });
            return;
        }

        const updatedContact = await contact.update(req.body);
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ message: "Failed to update contact", error: error.message });
    }
});

// Delete a contact
const deleteContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            res.status(404).json({ message: "Contact not found" });
            return;
        }

        // Check if the logged-in user owns the contact
        if (contact.user_id.toString() !== req.user.id) {
            res.status(403).json({ message: "User doesn't have permission to delete this contact" });
            return;
        }

        await contact.destroy();
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ message: "Failed to delete contact", error: error.message });
    }
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
};
