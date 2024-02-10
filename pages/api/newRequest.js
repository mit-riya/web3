// pages/api/request-verification.js
import mongoose from 'mongoose';
import connect from '../../models/connect';
// import VerificationRequest from '../../models/VerificationRequest';

export default async function handler(req, res) {
    try {
        const { requesterId, receiverId, details } = await req.body;
        await connect();
        const VerificationRequest = mongoose.models.VerificationRequest
        const verificationRequest = await VerificationRequest.create({ requesterId, receiverId, details });
        res.status(200).send("Successfully added");
    } catch (error) {
        console.error('Error creating verification request:', error);
        res.status(500).send('Data not correct');
    }
};
