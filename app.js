import express from 'express';
import dotenv from 'dotenv';
import getuserstatus from './controller/getUserStatus.js';
import router from './controller/getUser.js';
import getAdmin from './controller/getAdmin.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import fs from 'fs';
import AdminToken1 from './controller/AdminToken.js';
import UserToken1 from './controller/UserToken.js';
// import cors from 'cors';
const serviceAccount = JSON.parse(fs.readFileSync('./utils/watersupplypushnotification-firebase-adminsdk-u3gam-5757d1b3a5.json', 'utf8'));
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
app.use(cors({
  origin: '*',  // or specify your app's domain here
  methods: 'POST',
  allowedHeaders: 'Content-Type'
}));
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
