import { load } from 'cheerio';

export function extractLyricsVersions(html) {
  const $ = load(html);

  const linesForSingers = [];
  const linesWithChords = [];

  $('table').each((i, table) => {
    const chordsLine = $(table)
      .find('td.chords_en')
      .text()
      .replace(/\xa0/g, ' ')
      .trim();
    const lyricsLine = $(table)
      .find('td.song')
      .text()
      .replace(/\xa0/g, ' ')
      .trim();

    if (lyricsLine) linesForSingers.push(lyricsLine);
    if (chordsLine || lyricsLine) {
      if (chordsLine) linesWithChords.push(chordsLine);
      if (lyricsLine) linesWithChords.push(lyricsLine);
    }
  });

  const forSingers = linesForSingers.join('\n');
  const forPlayers = linesWithChords.join('\n');

  return {
    forSingers,
    forPlayers,
  };
}
