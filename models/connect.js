// Import the Mongoose library
import mongoose from 'mongoose';

// Retrieve the MongoDB URI from the environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Check if the MongoDB URI is provided
if (!MONGODB_URI) {
    throw new Error('Please provide a MongoDB URI');
}

// Async function to establish a connection to MongoDB
async function connect() {
    try {
        // Attempt to connect to MongoDB using Mongoose
        await mongoose.connect(MONGODB_URI);

        // Log a success message if the connection is successful
        console.log('Connected to MongoDB');
    } catch (error) {
        // Log an error message and exit the process if connection fails
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

// Export the connect function for use in other modules
module.exports = connect;
