import { DataTypes } from 'sequelize';
import sequelize from '../middleware/db.js'; // Assuming you have a database connection file
import Admin from './Admin.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Or true if optional
    references: {
      model: Admin, // Reference the Admin model
      key: 'id',    // Key in the Admin model
    },
  },
}, {
  tableName: 'users',  // Name of the table in the database
  timestamps: false,   // Disable automatic timestamps (createdAt, updatedAt)
});

// Define the association
Admin.hasMany(User, { foreignKey: 'adminId' });
User.belongsTo(Admin, { foreignKey: 'adminId' });

export default User;
