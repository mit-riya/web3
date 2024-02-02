import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || "mongodb+srv://himanshi:ZyCrarzYWJQTjLLU@cluster0.o64tbsd.mongodb.net/?retryWrites=true&w=majority";

if (!MONGODB_URI) {
    throw new Error('Please provide a MongoDB URI');
}

async function connect() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connect;
