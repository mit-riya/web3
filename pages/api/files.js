// Import necessary modules
import formidable from "formidable"; // Module for parsing form data
import fs from "fs"; // File system module for file operations
const pinataSDK = require("@pinata/sdk"); // Pinata SDK for interacting with Pinata
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT }); // Initialize Pinata SDK

// Export configuration for Next.js API route
export const config = {
  api: {
    bodyParser: false, // Disable built-in body parsing, we'll handle it with formidable
  },
};

// Function to save file to IPFS using Pinata
const saveFile = async (file, fields) => {
  try {
    // Create a read stream from the uploaded file
    const stream = fs.createReadStream(file.filepath);
    // Define options for pinning the file to IPFS, including metadata
    const options = {
      pinataMetadata: {
        name: fields.name, // Name of the file
      },
    };
    // Pin the file to IPFS using Pinata SDK
    const response = await pinata.pinFileToIPFS(stream, options);
    // Remove the temporary file from the server
    fs.unlinkSync(file.filepath);
    // Return the response from Pinata
    return response;
  } catch (error) {
    // If an error occurs, throw it
    throw error;
  }
};

// Handler function for the API route
export default async function handler(req, res) {
  // If the request method is POST
  if (req.method === "POST") {
    try {
      // Parse the incoming form data using formidable
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        try {
          // Check for parsing errors
          if (err) {
            console.log({ err });
            return res.status(500).send("Upload Error");
          }
          // Call the saveFile function to save the uploaded file to IPFS
          const response = await saveFile(files.file, fields);
          // Extract the IPFS hash from the response
          const { IpfsHash } = response;
          // Send the IPFS hash as the response
          return res.status(200).send(IpfsHash);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "GET") { // If the request method is GET
    try {
      // Retrieve a list of pinned items from Pinata
      const response = await pinata.pinList(
        { pinataJWTKey: process.env.PINATA_JWT }, // Pass Pinata JWT key
        {
          pageLimit: 1, // Limit the response to 1 item
        }
      );
      // Send the response as JSON
      res.json(response.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
}
