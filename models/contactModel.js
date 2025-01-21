const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Contact = sequelize.define('Contact', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            validate: {
                notNull: { msg: 'User ID is required' }
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Name is required' },
                notEmpty: { msg: 'Name is required' }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Email Address is required' },
                notEmpty: { msg: 'Email Address is required' },
                isEmail: { msg: 'Please enter a valid email address' }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Contact Phone Number is required' },
                notEmpty: { msg: 'Contact Phone Number is required' }
            }
        }
    }, {
        timestamps: true,
        tableName: 'contacts'
    });
    return Contact;
};