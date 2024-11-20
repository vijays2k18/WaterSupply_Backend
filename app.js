import express from 'express';
import dotenv from 'dotenv';
import getuserstatus from './controller/getUserStatus.js';
import router from './controller/getUser.js';
import getAdmin from './controller/getAdmin.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const corsOptions = {
  origin: 'http://localhost:8080', // Replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));
app.use(express.json()); // Use middleware to handle JSON requests

// Use the getUser routes
app.use(getuserstatus);
app.use(router);
app.use(getAdmin)

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
