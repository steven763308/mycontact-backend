const { sequelize } = require('../config/database');

// Import model definitions
// Ensure each model file exports the model as a function requiring `sequelize`
const User = require('./userModel')(sequelize); // User model
const Contact = require('./contactModel')(sequelize); // Contact model
const { EWallet, EwalletTransaction } = require('./ewalletModel')(sequelize); // EWallet models

// Define relationships
// User has one EWallet
User.hasOne(EWallet, {
    foreignKey: 'userId',
    as: 'wallet', // Alias for the association
    onDelete: 'CASCADE', // Delete wallet if user is deleted
});
EWallet.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user', // Alias for the association
});

// User has many Contacts
User.hasMany(Contact, {
    foreignKey: 'user_id',
    as: 'contacts', // Alias for the association
    onDelete: 'CASCADE', // Delete contacts if user is deleted
});
Contact.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user', // Alias for the association
});

// Export all models and sequelize instance in a single export
// Ensure this object includes all your models for centralized imports
module.exports = {
    User,
    Contact,
    EWallet,
    EwalletTransaction,
    sequelize, // Include Sequelize instance for reuse
};
