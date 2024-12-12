import express from 'express';
import AdminToken from '../models/AdminToken.js';
import sequelize from '../middleware/db.js';


const AdminToken1 = express.Router();

// Endpoint to save admin FCM token
AdminToken1.post('/save-fcm-token', async (req, res) => {
  const { user_id, admin_token } = req.body;  // Use 'admin_token' instead of 'fcm_token'

  // Validate input parameters
  if (!user_id || !admin_token) {
    return res.status(400).json({ message: 'User ID and Admin token are required' });
  }

  try {
    // Check if an AdminToken already exists for the given user_id
    const existingAdminToken = await AdminToken.findOne({
      where: { user_id },
    });

    if (existingAdminToken) {
      // Update the existing admin_token for the user
      existingAdminToken.admin_token = admin_token;
      await existingAdminToken.save();
      return res.status(200).json({ message: 'Admin token updated successfully' });
    } else {
      // If no existing token, create a new one
      await AdminToken.create({
        user_id,
        admin_token,  // Store 'admin_token' in the new entry
      });
      return res.status(200).json({ message: 'Admin token saved successfully' });
    }
  } catch (error) {
    // Log and send error response
    console.error('Error saving Admin token:', error);
    return res.status(500).json({
      message: 'Failed to save Admin token',
      error: error.message || error,
    });
  }
});


// Endpoint to send notification to admin
AdminToken1.post('/send-admin-notification', async (req, res) => {
  const { message, userId } = req.body; // Accept userId in the request

  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  if (!userId) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    // Retrieve admin tokens for the specified user ID
    const adminTokens = await AdminToken.findAll({ where: { user_id: userId } });

    if (adminTokens.length === 0) {
      return res.status(400).send({ error: 'No admin tokens found for the specified user ID' });
    }

    // Prepare notification payload
    const payload = {
      notification: {
        title: 'New Request',
        body: message,
      },
    };

    // Send notifications to the retrieved admin tokens
    const promises = adminTokens.map((token) =>
      admin.messaging().sendToDevice(token.admin_token, payload)
    );

    await Promise.all(promises);

    res.send({ success: true, message: `Notification sent successfully to user ID ${userId}` });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ error: 'Failed to send notification' });
  }
});


// Endpoint to get admin token by user_id
AdminToken1.get('/get-admin-token/:user_id', async (req, res) => {
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


export default AdminToken1;
