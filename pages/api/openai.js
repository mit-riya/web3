// pages/api/openai.js
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_TOKEN});


export default async function handler(req, res) {
  try {
    const completion = await openai.chat.completions.create({
        messages: req.body,
        model: "gpt-3.5-turbo",
    });
    return res.status(200).json(completion);
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to fetch completion from OpenAI" });
  }
}
