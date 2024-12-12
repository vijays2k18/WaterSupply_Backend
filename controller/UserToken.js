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
  const { message, userId } = req.body; // Accept userId in the request

  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  if (!userId) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    // Retrieve user tokens for the specified user ID
    const userTokens = await UserToken.findAll({ where: { user_id: userId } });

    if (userTokens.length === 0) {
      return res.status(400).send({ error: `No tokens found for user ID ${userId}` });
    }

    // Prepare notification payload
    const payload = {
      notification: {
        title: `Notification for User ID ${userId}`,
        body: message,
      },
    };

    // Send notification to all tokens associated with this user
    const promises = userTokens.map((token) =>
      admin.messaging().sendToDevice(token.user_token, payload)
    );

    await Promise.all(promises);

    res.send({ success: true, message: `Notification sent successfully to user ID ${userId}` });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ error: 'Failed to send notification' });
  }
});

// Endpoint to get user token by user_id
UserToken.get('/get-user-token/:user_id', async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    // Retrieve the user token for the given user_id
    const userToken = await UserToken.findOne({
      where: { user_id: user_id },
    });

    if (!userToken) {
      return res.status(404).send({ error: 'User token not found for this user' });
    }

    // Return the user token
    return res.send({ success: true, user_token: userToken.admin_token });
  } catch (error) {
    console.error('Error retrieving user token:', error);
    return res.status(500).send({ error: 'Failed to retrieve user token' });
  }
});


export default UserToken;
