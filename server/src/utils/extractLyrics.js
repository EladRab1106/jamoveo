import { load } from 'cheerio';

// Common chord patterns in both English and Hebrew
const CHORD_PATTERNS = [
  // Basic chords: Am, C, Dm7, etc.
  /^[A-G][#b]?(m|maj|dim|aug|sus[24]|[2-9])?(\/?[A-G][#b]?)?$/i,
  
  // Chords in parentheses: (Am) (C) etc.
  /^\([A-G][#b]?(m|maj|dim|aug|sus[24]|[2-9])?(\/?[A-G][#b]?)?\)$/i,
  
  // Hebrew chord names
  /^(לה|סי|דו|רה|מי|פה|סול)\s*(מינור|מז\'ור|דימ|מוגדל)?$/i,
  
  // Common chord modifiers
  /^(add|dim|aug|maj|min|m|M|\+|\-|sus[24]?|[2-9]|\/[A-G][#b]?)$/i
];

// Helper function to determine if a word might be a chord
function isChord(word) {
  word = word.trim();
  
  // Skip empty strings or long words (unlikely to be chords)
  if (!word || word.length > 15) return false;
  
  // Test against all chord patterns
  return CHORD_PATTERNS.some(pattern => pattern.test(word));
}

// Helper function to check if a line contains chords
function isChordLine(line) {
  if (!line.trim()) return false;
  
  // Remove common non-chord indicators
  const cleanLine = line.replace(/[,.!?:;]/g, '');
  
  // Split by whitespace and handle parentheses
  const words = cleanLine.split(/\s+/).map(word => {
    // Handle cases where chord is inside parentheses with other text
    if (word.includes('(') && word.includes(')')) {
      const matches = word.match(/\(([^)]+)\)/g);
      if (matches) {
        return matches.map(m => m.slice(1, -1)).filter(isChord).length > 0;
      }
    }
    return isChord(word);
  });
  
  const chordCount = words.filter(Boolean).length;
  
  // Consider it a chord line if:
  // 1. More than 30% of words are chords, OR
  // 2. Line starts with a chord and has at least 2 chords
  return (chordCount / words.length > 0.3) || (isChord(line.trim().split(/\s+/)[0]) && chordCount >= 2);
}

export function extractLyricsVersions(html) {
  const $ = load(html);
  
  const linesForSingers = [];
  const linesWithChords = [];
  let debugInfo = [];

  // First try to extract from table structure
  $('table').each((i, table) => {
    const chordsLine = $(table)
      .find('td.chords_en, td.chords')  // Added td.chords
      .text()
      .replace(/\xa0/g, ' ')
      .trim();
    const lyricsLine = $(table)
      .find('td.song, td.lyrics')  // Added td.lyrics
      .text()
      .replace(/\xa0/g, ' ')
      .trim();

    if (chordsLine) debugInfo.push(`Found chord line in table: ${chordsLine}`);
    if (lyricsLine) debugInfo.push(`Found lyrics line in table: ${lyricsLine}`);

    if (lyricsLine) linesForSingers.push(lyricsLine);
    if (chordsLine || lyricsLine) {
      if (chordsLine) linesWithChords.push(chordsLine);
      if (lyricsLine) linesWithChords.push(lyricsLine);
    }
  });

  // If no table structure found, try alternative extraction
  if (linesWithChords.length === 0) {
    debugInfo.push('No table structure found, trying alternative extraction');
    
    // Get all text content, trying different selectors
    const content = $('#songContentTPL, #songText, .noteBody, pre, .song-content').text();
    if (!content) {
      debugInfo.push('No content found in common selectors');
      return { forSingers: '', forPlayers: '', debugInfo };
    }

    // Split into lines and process each
    const lines = content.split('\n');
    let previousLineWasChord = false;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        previousLineWasChord = false;
        return;
      }

      // Check if line contains chords
      const containsChords = isChordLine(trimmedLine);
      const wordsInLine = trimmedLine.split(/\s+/);
      const chordsInLine = wordsInLine.filter(word => isChord(word));
      
      debugInfo.push(
        `Line ${index + 1}: "${trimmedLine}" - ` +
        `${containsChords ? 'Contains chords' : 'No chords'} ` +
        `(${chordsInLine.length}/${wordsInLine.length} words are chords: ${chordsInLine.join(', ')})`
      );

      if (containsChords) {
        linesWithChords.push(trimmedLine);
        previousLineWasChord = true;
      } else {
        // If this line follows a chord line, it's probably the lyrics for those chords
        if (previousLineWasChord) {
          linesWithChords.push(trimmedLine);
        }
        linesForSingers.push(trimmedLine);
        previousLineWasChord = false;
      }
    });
  }

  const forSingers = linesForSingers.join('\n');
  const forPlayers = linesWithChords.join('\n');

  // Add debug information to response
  console.log('Debug Information:', debugInfo.join('\n'));

  return {
    forSingers,
    forPlayers,
    debugInfo
  };
}
