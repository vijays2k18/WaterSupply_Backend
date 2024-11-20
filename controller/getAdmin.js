import express from 'express';
import Admin from '../models/Admin.js';
import sequelize from '../middleware/db.js';
import dotenv from 'dotenv';
import authenticateJWT from '../middleware/authentication.js';
import jwt from 'jsonwebtoken';
dotenv.config();

const getAdmin = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


// Create Admin API
getAdmin.post('/admin/create', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create a new admin
    const admin = await Admin.create({ username, password });
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
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
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token with only username
    const token = jwt.sign({ username: admin.username }, JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
  // Admin Login


  export default getAdmin;