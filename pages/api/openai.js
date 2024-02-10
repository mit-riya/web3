// pages/api/openai.js

// Import the OpenAI SDK
import OpenAI from "openai";

// Create a new instance of the OpenAI class with your API key from environment variables
const openai = new OpenAI({apiKey: process.env.OPENAI_API_TOKEN});

// Define an asynchronous function to handle API requests
export default async function handler(req, res) {
  try {
    // Call the OpenAI API to generate completions based on the incoming request body
    const completion = await openai.chat.completions.create({
        messages: req.body, // Messages from the user to generate completions
        model: process.env.MODEL_LOCATOR, // Model to use for generating completions
    });
    
    // Return the generated completions as a JSON response with a 200 status code
    return res.status(200).json(completion);
  } catch (error) {
    // If an error occurs, log the error and return a JSON response with a 500 status code
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to fetch completion from OpenAI" });
  }
}
