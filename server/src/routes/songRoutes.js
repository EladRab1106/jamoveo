import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { fetchSongData } from '../controllers/songController.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: 'Missing query parameter' });
  }

  try {
    const searchUrl = `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(query)}`;
    const { data: html } = await axios.get(searchUrl);
    const $ = cheerio.load(html);

    const results = [];

    $('a.ruSongLink').each((i, el) => {
      const title = $(el)
        .find('.sNameI19')
        .text()
        .trim()
        .replace('/', '')
        .trim();
      const artist = $(el).find('.aNameI19').text().trim();
      const link = 'https://www.tab4u.com/' + $(el).attr('href');

      if (title && artist && link) {
        results.push({ title, artist, link });
      }
    });

    res.json({ results });
  } catch (error) {
    console.error('❌ Error scraping Tab4U:', error.message);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
});

// songRoutes.js
router.get('/song', fetchSongData);

export default router;
