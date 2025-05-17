import puppeteer from 'puppeteer';
import { extractLyricsVersions } from '../utils/extractLyrics.js';

export const fetchSongData = async (req, res) => {
  const { link, role } = req.query;

  if (!link || !role) {
    return res.status(400).json({ message: 'Missing link or role parameter' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'domcontentloaded' });

    const content = await page.evaluate(() => {
      const el =
        document.querySelector('#songContentTPL') ||
        document.querySelector('#songText') ||
        document.querySelector('.noteBody');
      return el ? el.innerHTML : null;
    });

    await browser.close();

    if (!content) {
      return res
        .status(404)
        .json({ message: 'Could not extract song content' });
    }

    const { forSingers, forPlayers, debugInfo } = extractLyricsVersions(content);

    const response = {
      lyrics: role === 'singer' ? forSingers : forPlayers,
      ...(process.env.NODE_ENV === 'development' && { debugInfo })
    };

    if (role === 'singer') {
      return res.json(response);
    }

    if (role === 'player') {
      return res.json({ ...response, lyricsWithChords: response.lyrics });
    }

    return res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    console.error('❌ Puppeteer error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch song data' });
  }
};
