import express from 'express';
import sequelize from '../middleware/db.js';
import UserToken from '../models/UserToken.js';


const UserToken = express.Router();

// Endpoint to save admin FCM token
UserToken.post('/save-user-token', async (req, res) => {
  const { user_id, token } = req.body;

  if (!user_id || !token) {
    return res.status(400).send({ error: 'User ID and FCM token are required' });
  }

  try {
    // Check if the token already exists for the user
    const existingToken = await UserToken.findOne({
      where: {
        user_id: user_id,
        admin_token: token
      }
    });

    if (existingToken) {
      return res.status(200).send({ success: true, message: 'Token already exists' });
    }

    // Save the new token in the userTokens table
    await UserToken.create({
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
UserToken.post('/send-user-notification', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    // Retrieve all admin tokens from the database
    const userTokens = await UserToken.findAll();

    if (userTokens.length === 0) {
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
    const promises = userTokens.map((token) =>
      admin.messaging().sendToDevice(token.admin_token, payload)
    );

    await Promise.all(promises);

    res.send({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ error: 'Failed to send notification' });
  }
});

export default UserToken;