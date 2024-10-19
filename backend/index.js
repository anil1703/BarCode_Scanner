import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import cloudinary from './cloudinaryConfig.js'; // Import Cloudinary config
import multer from 'multer'; // Import multer for file uploads
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Import the correct constructor
import { routes } from "./Routes/routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configure multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Optional: folder name in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif'], // Optional: specify allowed formats
  },
});

const upload = multer({ storage: storage });

// Add image upload route
app.post('/upload', upload.single('image'), (req, res) => {
  // After uploading the image, Cloudinary returns the URL
  if (req.file) {
    return res.status(200).json({ url: req.file.path }); // Send the URL back to the client
  } else {
    return res.status(400).json({ error: 'Image upload failed' });
  }
});

// Use routes from the router.js file
app.use(routes);

const port = 5000;

// Retrieve the MongoDB URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
console.log(databaseUrl);

// Connect to MongoDB using Mongoose
mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Mongoose connection instance for event listeners
const database = mongoose.connection;

// Handle errors in the connection
database.on("error", () => {
  console.log("Error connecting to database");
});

// Handle successful connection
database.once("connected", () => {
  console.log("Connected to database");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
