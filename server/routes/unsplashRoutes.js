import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Unsplash!' });
});

router.route('/').post(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing prompt' });
  }

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();

    console.log('Unsplash API response:', data); // Log the full API response

    if (data.results && data.results.length > 0) {
      const image = data.results[0].urls.regular;
      res.status(200).json({ photo: image });
    } else {
      throw new Error('No images found');
    }
  } catch (error) {
    console.error('Error from Unsplash API:', error); // Log the error for debugging
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
