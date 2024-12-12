// models/AdminToken.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../middleware/db.js';

// Define the AdminToken model
const AdminToken = sequelize.define('AdminToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // The name of the users table
      key: 'id', // The primary key of the users table
    },
    onDelete: 'CASCADE', // Delete the admin token if the user is deleted
  },
  admin_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'AdminToken', // The name of the table in your database
  timestamps: false, // Disable createdAt and updatedAt columns
});

// Association with Users model (to be defined in your users model)
AdminToken.associate = function(models) {
  // Define the relationship between AdminToken and User
  AdminToken.belongsTo(models.User, { foreignKey: 'user_id' });
};

export default AdminToken;
