// models/Admin.js
import { DataTypes } from 'sequelize';
import sequelize from '../middleware/db.js';

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'admin',
  timestamps: false, // Disable createdAt and updatedAt columns
});

export default Admin;
