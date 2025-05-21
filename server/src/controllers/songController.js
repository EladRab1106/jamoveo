import puppeteer from 'puppeteer';
import chromium from 'chromium'; // ✅ מוסיף את chromium
import { extractLyricsVersions } from '../utils/extractLyrics.js';

export const fetchSongData = async (req, res) => {
  const { link, role } = req.query;

  if (!link || !role) {
    return res.status(400).json({ message: 'Missing link or role parameter' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-zygote'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || chromium.executablePath, // ✅ כאן משתנה
    });

    const page = await browser.newPage();
    await page.goto(link, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

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
    return res.status(500).json({ message: 'Failed to fetch song data', error: error.message });
  }
};
