import connect from '../../models/connect';
import mongoose from 'mongoose';
// import VerificationRequest from '../../models/VerificationRequest';


async function PUT(req, res) {
    try {
      const VerificationRequest = mongoose.models.VerificationRequest;
      const { requesterId, status } = await req.body;
      await connect();
      const updatedVerificationRequest = await VerificationRequest.findOneAndUpdate(
        { requesterId: requesterId },
        { $set: { status: status } },
        { new: true }
      );
      
  
      if (!updatedVerificationRequest) {
        res.status(404).json({ message: 'Verification request not found' });
        return;
      }
  
      res.status(200).json(updatedVerificationRequest);
    } catch (error) {
      console.error('Error updating verification request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  export default PUT;