const asyncHandler = require("express-async-handler");
const Contact = require('../models/contactModel'); // Ensure this path is correct
const User = require('../models/userModel'); // Ensure this is correctly imported if used

// Get all contacts
const getContacts = asyncHandler(async (req, res) => {
    try {
        console.log("Fetching contacts for user ID:", req.user.id);

        // Fetch all contacts associated with the user ID
        const contacts = await Contact.findAll({
            where: { user_id: req.user.id },
            //logging: console.log //log SQL query being executed
        });

        //console.log("Contacts fetched:", JSON.stringify(contacts, null, 2));
        res.status(200).json(contacts);
    } catch (error) {
        //console.error("Error fetching contacts:", error);
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
        console.log("Received request to get contact with ID:", req.params.id);
        const contact = await Contact.findByPk(req.params.id);
        
        if (!contact) {
            console.log("Contact not found for ID:", req.params.id);
            res.status(404).json({ message: "Contact not found" });
            return;
        }

        console.log(`Found contact with ID: ${req.params.id} for user ID: ${contact.user_id}`);
        
        // Convert both user_id values to integers for reliable comparison
        if (parseInt(contact.user_id) !== parseInt(req.user.id)) {
            console.log(`User ID mismatch: Contact owned by ${contact.user_id}, request by ${req.user.id}`);
            res.status(403).json({ message: "User doesn't have permission to view this contact" });
            return;
        }

        console.log(`Returning contact with ID: ${req.params.id} to user ID: ${req.user.id}`);
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
            console.log("Contact not found for ID:", req.params.id); // Debugging log
            res.status(404).json({ message: "Contact not found" });
            return;
        }

        // Debugging log to verify data types and values
        console.log(`User attempting to update contact: ${req.user.id} (Type: ${typeof req.user.id}), Contact owner ID: ${contact.user_id} (Type: ${typeof contact.user_id})`);

        // Convert both user_id values to integers for reliable comparison
        if (parseInt(contact.user_id) !== parseInt(req.user.id)) {
            console.log(`Permission denied: Contact owned by ${contact.user_id}, request by ${req.user.id}`); // Debugging log
            res.status(403).json({ message: "User doesn't have permission to update this contact" });
            return;
        }

        const updatedContact = await contact.update(req.body);
        console.log(`Contact updated successfully by user ${req.user.id}`); // Debugging log
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
            console.log("Contact not found for ID:", req.params.id); // Debugging log
            res.status(404).json({ message: "Contact not found" });
            return;
        }

        // Debugging log to verify data types and values
        console.log(`User attempting to delete contact: ${req.user.id} (Type: ${typeof req.user.id}), Contact owner ID: ${contact.user_id} (Type: ${typeof contact.user_id})`);

        // Convert both user_id values to integers for reliable comparison
        if (parseInt(contact.user_id) !== parseInt(req.user.id)) {
            console.log(`Permission denied: Contact owned by ${contact.user_id}, request by ${req.user.id}`); // Debugging log
            res.status(403).json({ message: "User doesn't have permission to delete this contact" });
            return;
        }

        await contact.destroy();
        console.log(`Contact deleted successfully by user ${req.user.id}`); // Debugging log
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
