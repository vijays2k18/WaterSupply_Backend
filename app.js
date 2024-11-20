import express from 'express';
import dotenv from 'dotenv';
import getuserstatus from './controller/getUserStatus.js';
import router from './controller/getUser.js';
import getAdmin from './controller/getAdmin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // Use middleware to handle JSON requests

// Use the getUser routes
app.use(getuserstatus);
app.use(router);
app.use(getAdmin)

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
