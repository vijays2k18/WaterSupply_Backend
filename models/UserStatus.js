import { DataTypes } from 'sequelize';
import sequelize from '../middleware/db.js';

const UserStatus = sequelize.define('UserStatus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // References the 'users' table
      key: 'Id'  // 'Id' is the primary key in the users table
    },
  },
  requested: {
    type: DataTypes.INTEGER,
    defaultValue: 0,  // Default value is 0 (not requested)
  },
  approved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,  // Default value is 0 (not approved)
  },
}, {
  tableName: 'user_status',
  timestamps: false,  // Disable automatic timestamps (createdAt, updatedAt)
});

export default UserStatus;