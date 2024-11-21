import { DataTypes } from 'sequelize';
import sequelize from '../middleware/db.js'; // Assuming you have a database connection file

const User = sequelize.define('User', {
  // Define columns based on the `users` table
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
}, {
  tableName: 'users',  // Name of the table in the database
  timestamps: false,   // Disable automatic timestamps (createdAt, updatedAt)
});

export default User;
