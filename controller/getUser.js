import express from 'express';
import User from '../models/getuser.js';  // Import the User model

const getUser = express.Router();

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
