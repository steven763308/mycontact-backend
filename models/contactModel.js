const {Model, DataTypes} = require('sequelize');
const sequelize = require('./config/database');

class Contact extends Model {}

Contact.init({
    //assuming 'user_id' is foreign key
    user_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Users', //table name of user model
            key: 'id',
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Please add the contact name" }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "Please add a valid email address" },
          notEmpty: { msg: "Please add the email address" }
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Please add the contact phone number" }
        }
      },
    }, {
      sequelize, // This is the instance of Sequelize you imported
      modelName: 'Contact',
      timestamps: true, // This enables the automatic creation of 'createdAt' and 'updatedAt' fields
});
    
module.exports = Contact;
