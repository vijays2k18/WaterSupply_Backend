import express from 'express';
import Requested from '../models/Requested.js';
import Delivery from '../models/Delivery.js';
import Approved from '../models/Approved.js';
import UserStatus from '../models/UserStatus.js';
const getuserstatus = express();

// Get all UserStatus
getuserstatus.get('/users/status', async (req, res) => {
  try {
    // Retrieve all user statuses from the user_status table
    const userStatuses = await UserStatus.findAll();  // Fetch all records from the table

    if (!userStatuses || userStatuses.length === 0) {
      return res.status(404).json({ message: 'No user statuses found' });
    }

    // Return the list of user statuses
    res.status(200).json(userStatuses);
  } catch (err) {
    console.error('Error fetching user statuses:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

getuserstatus.post('/user/requested', (req, res) => {
  console.log(req.body);  // Log the entire body to check the structure
  const id = req.body.userId; 
  console.log(id);  // Check if it's coming through correctly

  Requested(id)
    .then(() => res.status(200).json({ message: 'User status set to Requested' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

getuserstatus.post('/user/approved', (req, res) => {
  const id = parseInt(req.body.userId);  // Get the user ID from the request body
  Approved(id)
    .then(() => res.status(200).json({ message: 'User status set to Approved' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

getuserstatus.post('/user/delivery', (req, res) => {
  const id = parseInt(req.body.userId);  // Get the user ID from the request body
  Delivery(id)
    .then(() => res.status(200).json({ message: 'User status set to Delivery' }))
    .catch((err) => res.status(500).json({ message: err.message }));
});


getuserstatus.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default getuserstatus;

