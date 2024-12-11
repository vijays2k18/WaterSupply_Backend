import express from 'express';
import AdminToken from '../models/AdminToken.js';
import sequelize from '../middleware/db.js';


const AdminToken = express.Router();

// Endpoint to save admin FCM token
AdminToken.post('/save-admin-token', async (req, res) => {
  const { user_id, token } = req.body;

  if (!user_id || !token) {
    return res.status(400).send({ error: 'User ID and FCM token are required' });
  }

  try {
    // Check if the token already exists for the user
    const existingToken = await AdminToken.findOne({
      where: {
        user_id: user_id,
        admin_token: token
      }
    });

    if (existingToken) {
      return res.status(200).send({ success: true, message: 'Token already exists' });
    }

    // Save the new token in the AdminToken table
    await AdminToken.create({
      user_id: user_id,    // Link the token to a user
      admin_token: token,  // Store the admin token
    });

    return res.send({ success: true, message: 'Token saved successfully' });

  } catch (error) {
    console.error('Error saving admin token:', error);
    return res.status(500).send({ error: 'Failed to save token' });
  }
});

// Endpoint to send notification to admin
AdminToken.post('/send-admin-notification', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    // Retrieve all admin tokens from the database
    const adminTokens = await AdminToken.findAll();

    if (adminTokens.length === 0) {
      return res.status(400).send({ error: 'No admin tokens found' });
    }

    // Prepare notification payload
    const payload = {
      notification: {
        title: 'New Request',
        body: message,
      },
    };

    // Send notifications to all saved admin tokens
    const promises = adminTokens.map((token) =>
      admin.messaging().sendToDevice(token.admin_token, payload)
    );

    await Promise.all(promises);

    res.send({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ error: 'Failed to send notification' });
  }
});

// Endpoint to get admin token by user_id
AdminToken.get('/get-admin-token/:user_id', async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    // Retrieve the admin token for the given user_id
    const adminToken = await AdminToken.findOne({
      where: { user_id: user_id },
    });

    if (!adminToken) {
      return res.status(404).send({ error: 'Admin token not found for this user' });
    }

    // Return the admin token
    return res.send({ success: true, admin_token: adminToken.admin_token });
  } catch (error) {
    console.error('Error retrieving admin token:', error);
    return res.status(500).send({ error: 'Failed to retrieve admin token' });
  }
});


export default AdminToken;
