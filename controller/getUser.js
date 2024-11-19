import express from 'express';
import User from '../models/getuser.js';  // Import the User model
import authenticateJWT from '../middleware/authentication.js';
import jwt from 'jsonwebtoken';  // Import the authentication middleware

const getUser = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


// POST: Login using phone number
// POST: Login using phone number
getUser.post('/api/login', async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    // Find the user by phone number
    const user = await User.findOne({ where: { phone_number } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate JWT token
    const token = jwt.sign({ phone_number: user.phone_number, id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with success and token
    res.status(200).json({
      message: 'Login successful.',
      token, // Send token back to the client
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Use authentication middleware on all routes that need authentication
getUser.use(authenticateJWT);

// POST: Create a new user
getUser.post('/api/users', async (req, res) => {
  const { name, phone_number, address } = req.body;

  try {
    const newUser = await User.create({
      name,
      phone_number,
      address,
    });
    res.status(201).json(newUser);  // Respond with the created user
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Get all users
getUser.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();  // Fetch all users
    res.status(200).json(users);  // Respond with the list of users
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Get a user by ID
getUser.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);  // Respond with the found user
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT: Update a user by ID
getUser.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, phone_number, address } = req.body;

  try {
    const user = await User.findByPk(userId);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's data
    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.address = address || user.address;

    await user.save();  // Save the updated user
    res.status(200).json(user);  // Respond with the updated user
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Delete a user by ID
getUser.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();  // Delete the user
    res.status(200).json({ message: 'User deleted' });  // Respond with a success message
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default getUser;
