import express from 'express';
import createDB from './config/db.js';
import dotenv from 'dotenv';
import authenticationRoute from './router/authenticationRoute.js';
import cors from 'cors';
import imageRoute from './router/imageRouter.js';
import productsRoute from './router/productsRoute.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env configuration
dotenv.config();

const app = express();

const allowOrigin = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://mcov-backend.onrender.com',
  'https://mcov-backend.onrender.com/',
  'http://mcov-backend.onrender.com/',
  'http://mcov-backend.onrender.com',
  'https://mcov.netlify.app/',
  'https://mcov.netlify.app',
  'http://mcov.netlify.app/',
  'http://mcov.netlify.app/',
  undefined,
];

const corsOptions = {
  origin: 'https://mcov.netlify.app', // Allow your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Middleware to serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routers
app.use('/api/v1/auth', authenticationRoute);
app.use('/api/v1/image', imageRoute);
app.use('/api/v1/product', productsRoute);

// Connected
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Mobile Cover E-Commerce website',
  });
});

// Port setup
const PORT = 8080;

createDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
