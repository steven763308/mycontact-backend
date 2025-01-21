const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

/**
 * @desc Get all contacts for the authenticated user
 * @route GET /api/contacts
 * @access Private
 */
const getContacts = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    try {
        const contacts = await Contact.findAll({ where: { user_id: userId } });
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error.message);
        res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
    }
});

/**
 * @desc Create a new contact
 * @route POST /api/contacts
 * @access Private
 */
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: "All fields are mandatory!" });
    }

    try {
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id,
        });

        res.status(201).json(contact);
    } catch (error) {
        console.error("Error creating contact:", error.message);
        res.status(500).json({ message: "Failed to create contact", error: error.message });
    }
});

/**
 * @desc Get a single contact by ID
 * @route GET /api/contacts/:id
 * @access Private
 */
const getContact = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const contactId = req.params.id;

    try {
        const contact = await Contact.findByPk(contactId);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        if (parseInt(contact.user_id) !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied to this contact" });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error("Error fetching contact:", error.message);
        res.status(500).json({ message: "Failed to fetch contact", error: error.message });
    }
});

/**
 * @desc Update a contact by ID
 * @route PUT /api/contacts/:id
 * @access Private
 */
const updateContact = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const contactId = req.params.id;

    try {
        const contact = await Contact.findByPk(contactId);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        if (parseInt(contact.user_id) !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied to update this contact" });
        }

        const updatedContact = await contact.update(req.body);
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error("Error updating contact:", error.message);
        res.status(500).json({ message: "Failed to update contact", error: error.message });
    }
});

/**
 * @desc Delete a contact by ID
 * @route DELETE /api/contacts/:id
 * @access Private
 */
const deleteContact = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const contactId = req.params.id;

    try {
        const contact = await Contact.findByPk(contactId);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        if (parseInt(contact.user_id) !== parseInt(userId)) {
            return res.status(403).json({ message: "Access denied to delete this contact" });
        }

        await contact.destroy();
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error.message);
        res.status(500).json({ message: "Failed to delete contact", error: error.message });
    }
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
