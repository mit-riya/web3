// Import Mongoose library
import mongoose from 'mongoose';

// Define the schema for VerificationRequest
const VerificationRequestSchema = new mongoose.Schema({
  requesterId: { type: String, required: true },
  receiverId: { type: String, required: true },
  details: { type: [Number], required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  response: { type: [String] },
});

// Export the model using the existing model if available; otherwise, create a new one
module.exports = mongoose.models.VerificationRequest || mongoose.model('VerificationRequest', VerificationRequestSchema);
