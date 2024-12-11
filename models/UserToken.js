// models/UserToken.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../middleware/db.js'; // Make sure this path is correct

// Define the UserToken model
const UserToken = sequelize.define('UserToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // The name of the users table
      key: 'id',       // The primary key of the users table
    },
    onDelete: 'CASCADE',  // Deletes associated UserTokens when the user is deleted
  },
  admin_token: {
    type: DataTypes.STRING(1000),
    allowNull: false,  // Admin token cannot be null
  },
}, {
  tableName: 'UserToken',  // Table name in the database
  timestamps: false,       // No createdAt/updatedAt columns
});

// Association with Users model
UserToken.associate = function(models) {
  // UserToken belongs to User (one-to-many relationship)
  UserToken.belongsTo(models.User, { foreignKey: 'user_id' });
};

export default UserToken;
