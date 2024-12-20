import express from 'express';
import User from '../models/getuser.js';  // Import the User model
import authenticateJWT from '../middleware/authentication.js';
import jwt from 'jsonwebtoken';  // Import the authentication middleware
import colors from 'colors';  // For colorful console logging
import UserStatus from '../models/UserStatus.js';
import Admin from '../models/Admin.js';

const getUser = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST: Login using phone number
// POST: Login using phone number
getUser.post('/api/login', async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    console.warn('Phone number is missing'.yellow);
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    // Find the user by phone number
    const user = await User.findOne({ where: { phone_number } });

    if (!user) {
      console.warn('User not found'.yellow);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { phone_number: user.phone_number, id: user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful'.green);
    res.status(200).json({
      message: 'Login successful.',
      token, // Send token back to the client
      userId: user.id, 
      name: user.name// Include the user ID in the response
    });
  } catch (err) {
    console.error('Error during login:'.red, err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Use authentication middleware on all routes that need authentication
getUser.use(authenticateJWT);

// POST: Create a new user
getUser.post('/api/users', async (req, res) => {
  const { name, phone_number, address, adminId } = req.body;

  try {
    // Check if the phone number already exists in the database
    const existingUser = await User.findOne({ where: { phone_number } });
    if (existingUser) {
      return res.status(400).json({
        message: 'Phone number already in use. Please use a different number.',
      });
    }

    // Ensure the adminId exists in the Admin table
    const adminExists = await Admin.findByPk(adminId);
    if (!adminExists) {
      return res.status(400).json({
        message: 'Invalid admin ID. Please provide a valid admin ID.',
      });
    }

    // Create the new user if the phone number is unique
    const newUser = await User.create({
      name,
      phone_number,
      address,
      adminId, // Associate the user with the admin ID
    });

    console.log('User created successfully'.green);
    res.status(201).json(newUser); // Respond with the created user
  } catch (err) {
    console.error('Error creating user:'.red, err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// GET: Get all users
getUser.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();  // Fetch all users
    console.log('Fetched all users successfully'.cyan);
    res.status(200).json(users);  // Respond with the list of users
  } catch (err) {
    console.error('Error fetching users:'.red, err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Get a user by ID
getUser.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);  // Find user by ID
    if (!user) {
      console.warn('User not found'.yellow);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`User with ID ${userId} fetched successfully`.cyan);
    res.status(200).json(user);  // Respond with the found user
  } catch (err) {
    console.error('Error fetching user by ID:'.red, err.message);
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
      console.warn(`User with ID ${userId} not found`.yellow);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's data
    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.address = address || user.address;

    await user.save();  // Save the updated user
    console.log(`User with ID ${userId} updated successfully`.green);
    res.status(200).json(user);  // Respond with the updated user
  } catch (err) {
    console.error('Error updating user:'.red, err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Delete a user by ID
getUser.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id; // This is the user ID being passed
  try {
    const user = await User.findByPk(userId); // Find user by ID
    if (!user) {
      console.warn(`User with ID ${userId} not found`.yellow);
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated entries in other tables
    await UserStatus.destroy({ where: { user_id: userId } }); // Delete user's status entry
    // User's orders or other associations should be handled similarly if applicable.

    // Delete the user
    await user.destroy();
    // update

    console.log(`User with ID ${userId} and associated entries deleted successfully`.green);
    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:'.red, err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



export default getUser;
