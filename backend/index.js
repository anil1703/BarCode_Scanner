import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { routes } from "./Routes/routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes)
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

// Use routes from the router.js file

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
