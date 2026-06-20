// Semitone intervals relative to root note
const CHORD_FORMULAS: Record<string, { intervals: number[]; name: string }> = {
  'major': { intervals: [4, 7], name: '' },
  'minor': { intervals: [3, 7], name: 'm' },
  'diminished': { intervals: [3, 6], name: 'dim' },
  'augmented': { intervals: [4, 8], name: 'aug' },
  'sus4': { intervals: [5, 7], name: 'sus4' },
  'sus2': { intervals: [2, 7], name: 'sus2' },
  'major7': { intervals: [4, 7, 11], name: 'maj7' },
  'minor7': { intervals: [3, 7, 10], name: 'm7' },
  'dominant7': { intervals: [4, 7, 10], name: '7' },
  'diminished7': { intervals: [3, 6, 9], name: 'dim7' },
  'halfDiminished7': { intervals: [3, 6, 10], name: 'm7b5' },
  'minorMajor7': { intervals: [3, 7, 11], name: 'mM7' },
  'sixth': { intervals: [4, 7, 9], name: '6' },
  'minorSixth': { intervals: [3, 7, 9], name: 'm6' },
  'ninth': { intervals: [4, 7, 10, 14], name: '9' },
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Get note value in semitones (C = 0, B = 11)
const getNoteValue = (note: string): number => {
  const pitch = note.replace(/\d/, '');
  return NOTE_NAMES.indexOf(pitch);
};

// Get absolute midi value of note (C0 = 12, C4 = 60, etc.)
const getMidiValue = (note: string): number => {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 0;
  const [, pitch, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const pitchIndex = NOTE_NAMES.indexOf(pitch);
  return (octave + 1) * 12 + pitchIndex;
};

export const detectChord = (notes: string[]): string => {
  if (notes.length < 3) return '';

  // Sort notes by their MIDI values to arrange lowest pitch as potential bass/root
  const sortedNotes = [...notes].sort((a, b) => getMidiValue(a) - getMidiValue(b));
  const midiVals = sortedNotes.map(getMidiValue);
  
  // Try each note in the chord as the root (to handle inversions!)
  for (let rootIdx = 0; rootIdx < sortedNotes.length; rootIdx++) {
    const rootMidi = midiVals[rootIdx];
    const rootName = sortedNotes[rootIdx].replace(/\d/, '');

    // Get intervals of all other notes relative to this root (modulo 12 for octave independence)
    const relativeIntervals = midiVals
      .map((midi) => {
        let diff = (midi - rootMidi) % 12;
        if (diff < 0) diff += 12;
        return diff;
      })
      .filter((interval, index, self) => interval !== 0 && self.indexOf(interval) === index) // Unique non-root intervals
      .sort((a, b) => a - b);

    // Check against standard chord formulas
    for (const key in CHORD_FORMULAS) {
      const formula = CHORD_FORMULAS[key];
      
      // Match formulas (length and values)
      if (formula.intervals.length === relativeIntervals.length) {
        const matches = formula.intervals.every((val, i) => val === relativeIntervals[i]);
        if (matches) {
          const inversionText = rootIdx > 0 ? ` / ${sortedNotes[0].replace(/\d/, '')}` : '';
          return `${rootName}${formula.name}${inversionText}`;
        }
      }
    }
  }

  return 'Complex Chord';
};

// Scale mappings for practice guide mode
export const SCALES: Record<string, { name: string; intervals: number[] }> = {
  major: {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11]
  },
  minor: {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10]
  },
  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11]
  },
  pentatonicMajor: {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9]
  },
  pentatonicMinor: {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10]
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10]
  }
};

// Check if a note is in a specific scale
export const isNoteInScale = (note: string, scaleRoot: string, scaleType: string): boolean => {
  const noteVal = getNoteValue(note);
  const rootVal = NOTE_NAMES.indexOf(scaleRoot);
  if (rootVal === -1) return false;

  // Calculate interval relative to scale root
  let interval = (noteVal - rootVal) % 12;
  if (interval < 0) interval += 12;

  const scale = SCALES[scaleType];
  if (!scale) return false;

  return scale.intervals.includes(interval);
};
export default detectChord;
