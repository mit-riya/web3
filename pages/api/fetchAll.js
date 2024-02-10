// Import the necessary dependencies
import connect from '../../models/connect'; 
import mongoose from 'mongoose'; 
import VerificationRequest from '../../models/VerificationRequest';

async function GET(req, res) {
    try {

        // This model is used to interact with the verification requests stored in the database.
        const VerificationRequest = mongoose.models.VerificationRequest
        
        // Establish a connection to the database using the connect function.
        await connect();
        console.log(mongoose.models)
        // Fetch all documents from the VerificationRequest collection in the database.
        const pendingRequests = await VerificationRequest.find({});
        
        // Respond with a status code of 200 (OK) and the JSON representation of the pending requests.
        res.status(200).json(pendingRequests);
    } catch (error) {
        // Log any errors that occur during the operation to the console.
        console.error('Error fetching pending requests:', error);
        
        // Respond with a status code of 500 (Internal Server Error) and a JSON object indicating an error occurred.
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = GET;
