import express from 'express';
import * as dotenv from 'dotenv';
import {OpenAI} from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing prompt' });
  }

  try {
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    console.log('AI Response:', aiResponse); // Log the response for debugging

    const image = aiResponse.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error for debugging

    const errorMessage = error?.response?.data?.error?.message || 'Something went wrong';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
