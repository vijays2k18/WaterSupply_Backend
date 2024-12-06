import express from 'express';
import Requested from '../models/Requested.js';
import Delivery from '../models/Delivery.js';
import Approved from '../models/Approved.js';
import UserStatus from '../models/UserStatus.js';
import authenticateJWT from '../middleware/authentication.js';
import colors from 'colors'; // Import colors package

const getuserstatus = express();
getuserstatus.use(authenticateJWT);

// Get all UserStatus
getuserstatus.get('/users/status', async (req, res) => {
  try {
    console.log('Fetching all user statuses'.blue);

    // Retrieve all user statuses from the user_status table
    const userStatuses = await UserStatus.findAll();

    if (!userStatuses || userStatuses.length === 0) {
      console.warn('No user statuses found'.yellow);
      return res.status(404).json({ message: 'No user statuses found' });
    }

    console.log('User statuses retrieved successfully'.green);
    res.status(200).json(userStatuses);
  } catch (err) {
    console.error('Error fetching user statuses:'.red, err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

getuserstatus.post('/user/requested', (req, res) => {
  console.log('Request received for setting status to Requested'.blue);
  console.log('Request body:'.cyan, req.body); // Log the entire body
  const id = req.body.userId;
  console.log(`User ID: ${id}`.magenta);

  Requested(id)
    .then(() => {
      console.log(`User status set to Requested for ID: ${id}`.green);
      res.status(200).json({ message: 'User status set to Requested' });
    })
    .catch((err) => {
      console.error('Error setting user status to Requested:'.red, err.message);
      res.status(500).json({ message: err.message });
    });
});

getuserstatus.post('/user/approved', (req, res) => {
  console.log('Request received for setting status to Approved'.blue);
  const id = parseInt(req.body.userId);
  console.log(`User ID: ${id}`.magenta);

  Approved(id)
    .then(() => {
      console.log(`User status set to Approved for ID: ${id}`.green);
      res.status(200).json({ message: 'User status set to Approved' });
    })
    .catch((err) => {
      console.error('Error setting user status to Approved:'.red, err.message);
      res.status(500).json({ message: err.message });
    });
});

getuserstatus.post('/user/delivery', (req, res) => {
  console.log('Request received for setting status to Delivery'.blue);
  const id = parseInt(req.body.userId);
  console.log(`User ID: ${id}`.magenta);

  Delivery(id)
    .then(() => {
      console.log(`User status set to Delivery for ID: ${id}`.green);
      res.status(200).json({ message: 'User status set to Delivery' });
    })
    .catch((err) => {
      console.error('Error setting user status to Delivery:'.red, err.message);
      res.status(500).json({ message: err.message });
    });
});

export default getuserstatus;
