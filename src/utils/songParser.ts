import type { Song, SongNote, SongLyric, SongChord } from '../store/settings';

// Parse timestamp strings e.g. "01:23.45" or "[00:04.5]" to milliseconds
export const parseTimeToMs = (timeStr: string): number => {
  const clean = timeStr.replace(/[\[\]]/g, '').trim();
  const parts = clean.split(':');
  
  if (parts.length < 2) {
    const rawSec = parseFloat(clean);
    return isNaN(rawSec) ? 0 : Math.round(rawSec * 1000);
  }

  const min = parseInt(parts[0], 10);
  const sec = parseFloat(parts[1]);

  if (isNaN(min) || isNaN(sec)) return 0;

  return Math.round((min * 60 + sec) * 1000);
};

export const parseSongFromText = (text: string): Song => {
  const lines = text.split('\n');
  
  let currentSection = '';
  const settings: Record<string, string> = {
    title: 'Custom Created Song',
    artist: 'Self',
    bpm: '120',
    difficulty: 'medium',
  };

  const notes: SongNote[] = [];
  const lyrics: SongLyric[] = [];
  const chords: SongChord[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//') || line.startsWith('#')) continue; // Skip comments / empty lines

    // Detect section headers
    if (line.startsWith('[') && line.endsWith(']') && !line.includes(':')) {
      currentSection = line.slice(1, -1).toUpperCase();
      continue;
    }

    // Process depending on current active section block
    switch (currentSection) {
      case 'SETTINGS': {
        const eqIdx = line.indexOf('=');
        if (eqIdx > 0) {
          const key = line.slice(0, eqIdx).trim().toLowerCase();
          const val = line.slice(eqIdx + 1).trim();
          settings[key] = val;
        }
        break;
      }

      case 'LYRICS': {
        // Expected format: "[00:04.50] Hello darkness" or "[00:05] My old friend"
        const match = line.match(/^(\[[0-9:\.]+\])(.+)$/);
        if (match) {
          const time = parseTimeToMs(match[1]);
          const lyricText = match[2].trim();
          lyrics.push({ time, text: lyricText });
        }
        break;
      }

      case 'CHORDS': {
        // Expected format: "[00:04.50] Am" or "[00:05] C"
        const match = line.match(/^(\[[0-9:\.]+\])(.+)$/);
        if (match) {
          const time = parseTimeToMs(match[1]);
          const chordName = match[2].trim();
          chords.push({ time, chord: chordName });
        }
        break;
      }

      case 'NOTES': {
        // Expected format: "00:04.50 C4 500" (time, note, durationMs) or "00:04.50 C4" (defaults to 300ms)
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const time = parseTimeToMs(parts[0]);
          const note = parts[1].toUpperCase().trim();
          const duration = parts.length >= 3 ? parseInt(parts[2], 10) : 350;
          
          // Verify valid note format (e.g. C4, A#5, Gb2)
          if (note.match(/^[A-G]#?\d$/) || note.match(/^[A-G]b?\d$/)) {
            // Replace flat notations with sharp for easier mapping
            let normalizedNote = note;
            if (note.includes('b')) {
              normalizedNote = flatToSharp(note);
            }
            notes.push({ time, note: normalizedNote, duration });
          }
        }
        break;
      }
    }
  }

  // Sort notes, lyrics, and chords chronologically
  notes.sort((a, b) => a.time - b.time);
  lyrics.sort((a, b) => a.time - b.time);
  chords.sort((a, b) => a.time - b.time);

  // Determine overall duration based on maximum time found
  let duration = 5000; // minimum 5s
  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    duration = Math.max(duration, lastNote.time + lastNote.duration);
  }
  if (lyrics.length > 0) {
    duration = Math.max(duration, lyrics[lyrics.length - 1].time + 1000);
  }

  return {
    id: `custom-song-${Date.now()}-${Math.random()}`,
    title: settings.title,
    artist: settings.artist,
    bpm: parseInt(settings.bpm, 10) || 120,
    difficulty: (settings.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    notes,
    lyrics,
    chords,
    duration,
    isCustom: true,
  };
};

// Map flats to sharps for standard playback keys consistency (e.g. Db4 -> C#4)
const flatToSharp = (flatNote: string): string => {
  const flatsMap: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
  };
  const match = flatNote.match(/^([A-G]b)(\d)$/);
  if (!match) return flatNote;
  
  const [, flat, octave] = match;
  const sharp = flatsMap[flat] || flat;
  return `${sharp}${octave}`;
};
