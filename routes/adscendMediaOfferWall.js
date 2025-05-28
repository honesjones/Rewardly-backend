// src/routes/adscend.ts
import express from 'express';
import axios from 'axios';
require('dotenv').config();
const router = express.Router();

router.get('/offers', async (req, res) => {
  try {
    const response = await axios.get('https://api.adscendmedia.com/v1/publisher/116668/offers.json', {
      auth: {
        username: process.env.ADS_USER,
        password: process.env.ADS_PASS, // 👈 secure this later via env vars
      }
    });

    res.json(response.data.offers); // send only offers array
  } catch (err) {
    console.error('Adscend fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch offers from AdscendMedia' });
  }
});

export default router;
