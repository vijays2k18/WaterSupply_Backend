import { Sequelize } from 'sequelize';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Create a Sequelize instance and configure connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Disable SQL query logging
});

try {
  await sequelize.authenticate();
  console.log('Connection to the MySQL database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
