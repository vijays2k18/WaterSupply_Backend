import express from 'express';
import Admin from '../models/Admin.js';
import sequelize from '../middleware/db.js';
import dotenv from 'dotenv';
import authenticateJWT from '../middleware/authentication.js';
import jwt from 'jsonwebtoken';
import helmet from 'helmet'; // For security headers
import cors from 'cors'; // For cross-origin resource sharing
import colors from 'colors';
dotenv.config();

const getAdmin = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Apply global middleware
getAdmin.use(helmet()); // Adds security headers


// Create Admin API
getAdmin.post('/admin/create', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create a new admin
    const admin = await Admin.create({ username, password });
    console.log('Admin created successfully'.green);
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    res.status(500).json({ error: error.message });
  }
});

// Login API with token generation
getAdmin.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate username and password
    const admin = await Admin.findOne({ where: { username, password } });
    if (!admin) {
      console.warn('Invalid username or password'.yellow);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token with only username
    const token = jwt.sign({ username: admin.username }, JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    console.log('Login successful'.cyan);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    res.status(500).json({ error: error.message });
  }
});

export default getAdmin;
