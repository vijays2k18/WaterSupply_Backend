import express from 'express';
import dotenv from 'dotenv';
import getuserstatus from './controller/getUserStatus.js';
import router from './controller/getUser.js';
import getAdmin from './controller/getAdmin.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import fs from 'fs';
import AdminToken1 from './models/AdminToken.js';
import UserToken1 from './models/UserToken.js';
const serviceAccount = JSON.parse(fs.readFileSync('./utils/pushnotification-e4015-firebase-adminsdk-i6gwb-097cc12c0d.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json()); // Use middleware to handle JSON requests

// Use the getUser routes
app.use(getuserstatus);
app.use(router);
app.use(getAdmin);
app.use(bodyParser.json());
app.use(AdminToken1);
app.use(UserToken1);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
