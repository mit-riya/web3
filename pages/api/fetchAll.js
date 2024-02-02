import { NextRequest } from "next/server";
import connect from '../../models/connect';
import mongoose from 'mongoose';


async function GET(req, res) {
    try {
        console.log(mongoose.models)
        const VerificationRequest = mongoose.models.VerificationRequest
        await connect();
        const pendingRequests = await VerificationRequest.find({
            status: 'Pending',
        });

        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);

        // Log additional information about the request to help identify the issue
        // console.error('Request details:', req);

        // Return an appropriate JSON response
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = GET;
