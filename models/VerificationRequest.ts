import mongoose from 'mongoose';

const VerificationRequestSchema = new mongoose.Schema({
  requesterId: { type: String, required: true },
  receiverId: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
});

const VerificationRequest = mongoose.model('VerificationRequest', VerificationRequestSchema);

module.exports = VerificationRequest;
