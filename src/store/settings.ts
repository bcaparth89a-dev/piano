import { create } from 'zustand';

export interface SongNote {
  note: string;
  time: number; // in milliseconds
  duration: number; // in milliseconds
  velocity?: number;
  hit?: boolean;
  missed?: boolean;
}

export interface SongLyric {
  time: number; // in milliseconds
  text: string;
}

export interface SongChord {
  time: number; // in milliseconds
  chord: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: 'easy' | 'medium' | 'hard';
  notes: SongNote[];
  lyrics: SongLyric[];
  chords: SongChord[];
  duration: number; // in milliseconds
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface RecordedTrack {
  id: string;
  name: string;
  date: string;
  notes: { note: string; time: number; duration?: number; velocity: number }[];
  duration: number; // in milliseconds
  instrument: string;
}

export interface PracticeStats {
  notesPlayed: number;
  totalPlayTime: number; // in seconds
  sessionsCount: number;
  lastPlayedDate: string;
}

interface PianoState {
  // Persistent Settings
  theme: 'dark' | 'light';
  pianoVolume: number;
  songVolume: number;
  reverb: number;
  instrument: string;
  showLabels: boolean;
  chordDetection: boolean;
  scalePractice: boolean;
  scaleRoot: string;
  scaleType: string;
  fallingSpeed: number; // falling notes speed multiplier
  keyMap: Record<string, string>;
  stats: PracticeStats;
  recordedTracks: RecordedTrack[];
  customSongs: Song[];
  favoriteSongIds: string[];

  // Timeline / Playback States
  activeSong: Song | null;
  isPlayingSong: boolean;
  songTime: number; // current time of song playback in milliseconds
  songSpeed: number; // playback multiplier: 0.5x, 0.75x, 1x, etc.
  waitMode: boolean; // pause song timeline until correct key is pressed
  loopActive: boolean;
  shuffleActive: boolean;
  sustain: boolean;
  metronomeBpm: number;
  metronomeOn: boolean;
  octaveShift: number;
  activeKeys: string[];
  noteHistory: { note: string; id: string; timestamp: number }[];
  heatmap: Record<string, number>;
  midiDevices: string[];
  selectedMidiDevice: string | null;
  chordName: string;

  // Scoring / Performance States
  currentScore: number;
  correctNotesCount: number;
  missedNotesCount: number;
  streak: number;
  maxStreak: number;
  showScoreboard: boolean;
  activePage: 'piano' | 'developer';

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setPianoVolume: (volume: number) => void;
  setSongVolume: (volume: number) => void;
  setReverb: (reverb: number) => void;
  setInstrument: (instrument: string) => void;
  setShowLabels: (show: boolean) => void;
  setChordDetection: (enable: boolean) => void;
  setScalePractice: (enable: boolean) => void;
  setScaleRoot: (root: string) => void;
  setScaleType: (type: string) => void;
  setFallingSpeed: (speed: number) => void;
  updateKeyMap: (computerKey: string, note: string) => void;
  resetKeyMapToDefault: () => void;
  toggleFavoriteSong: (songId: string) => void;
  addCustomSong: (song: Song) => void;
  deleteCustomSong: (songId: string) => void;

  // Playback Control Actions
  setActiveSong: (song: Song | null) => void;
  setIsPlayingSong: (playing: boolean) => void;
  setSongTime: (time: number) => void;
  setSongSpeed: (speed: number) => void;
  setWaitMode: (enable: boolean) => void;
  setLoopActive: (enable: boolean) => void;
  setShuffleActive: (enable: boolean) => void;
  setSustain: (sustain: boolean) => void;
  setMetronomeBpm: (bpm: number) => void;
  setMetronomeOn: (on: boolean) => void;
  setOctaveShift: (shift: number | ((prev: number) => number)) => void;

  // Note hit actions
  addActiveKey: (key: string) => void;
  removeActiveKey: (key: string) => void;
  clearActiveKeys: () => void;
  addNoteToHistory: (note: string) => void;
  clearHistory: () => void;
  setChordName: (name: string) => void;

  // Scoring actions
  resetScore: () => void;
  triggerNoteHit: (note: string) => void;
  triggerNoteMiss: (note: string) => void;
  setShowScoreboard: (show: boolean) => void;

  // MIDI actions
  setMidiDevices: (devices: string[]) => void;
  setSelectedMidiDevice: (device: string | null) => void;

  // Stats actions
  incrementNotesPlayed: () => void;
  addPlayTime: (seconds: number) => void;

  // Recording actions
  isRecording: boolean;
  recordingStartTime: number | null;
  currentRecordingNotes: { note: string; time: number; velocity: number }[];
  startRecording: () => void;
  stopRecording: (trackName?: string) => void;
  recordNote: (note: string, velocity: number) => void;
  deleteTrack: (id: string) => void;
  setActivePage: (activePage: 'piano' | 'developer') => void;
}

const DEFAULT_KEYMAP: Record<string, string> = {
  // QWERTY & Top Row (C4 to A5)
  'q': 'C4',
  '2': 'C#4',
  'w': 'D4',
  '3': 'D#4',
  'e': 'E4',
  'r': 'F4',
  '5': 'F#4',
  't': 'G4',
  '6': 'G#4',
  'y': 'A4',
  '7': 'A#4',
  'u': 'B4',
  'i': 'C5',
  '9': 'C#5',
  'o': 'D5',
  '0': 'D#5',
  'p': 'E5',
  '[': 'F5',
  '-': 'F#5',
  ']': 'G5',
  '=': 'G#5',
  '\\': 'A5',

  // Bottom & Home Row (F5 to A6)
  'z': 'F5',
  's': 'F#5',
  'x': 'G5',
  'd': 'G#5',
  'c': 'A5',
  'f': 'A#5',
  'v': 'B5',
  'b': 'C6',
  'h': 'C#6',
  'n': 'D6',
  'j': 'D#6',
  'm': 'E6',
  ',': 'F6',
  'l': 'F#6',
  '.': 'G6',
  ';': 'G#6',
  '/': 'A6',
  "'": 'A#6',

  // Extra keys mapped to logical low/high notes so EVERY key is unique and has a note
  '1': 'B3',
  '4': 'E4',
  '8': 'B4',
  'a': 'A#3',
  'g': 'C#4',
  'k': 'D#5',
};

// Helper to get local storage values with fallbacks
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key', key, error);
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key', key, error);
  }
};

export const usePianoStore = create<PianoState>((set, get) => ({
  // Persistent Settings
  theme: getLocalStorage<'dark' | 'light'>('piano_theme', 'dark'),
  pianoVolume: getLocalStorage<number>('piano_volume', 0.8),
  songVolume: getLocalStorage<number>('piano_songVolume', 0.8),
  reverb: getLocalStorage<number>('piano_reverb', 0.3),
  instrument: getLocalStorage<string>('piano_instrument', 'piano'),
  showLabels: getLocalStorage<boolean>('piano_showLabels', true),
  chordDetection: getLocalStorage<boolean>('piano_chordDetection', true),
  scalePractice: getLocalStorage<boolean>('piano_scalePractice', false),
  scaleRoot: getLocalStorage<string>('piano_scaleRoot', 'C'),
  scaleType: getLocalStorage<string>('piano_scaleType', 'major'),
  fallingSpeed: getLocalStorage<number>('piano_fallingSpeed', 1.0),
  keyMap: getLocalStorage<Record<string, string>>('piano_keymap_v3', DEFAULT_KEYMAP),
  activePage: 'piano',
  stats: getLocalStorage<PracticeStats>('piano_stats', {
    notesPlayed: 0,
    totalPlayTime: 0,
    sessionsCount: 0,
    lastPlayedDate: new Date().toLocaleDateString(),
  }),
  recordedTracks: getLocalStorage<RecordedTrack[]>('piano_recorded_tracks', []),
  customSongs: getLocalStorage<Song[]>('piano_custom_songs', []),
  favoriteSongIds: getLocalStorage<string[]>('piano_favorites', []),

  // Timeline / Playback States
  activeSong: null,
  isPlayingSong: false,
  songTime: 0,
  songSpeed: 1.0,
  waitMode: false,
  loopActive: false,
  shuffleActive: false,
  sustain: false,
  metronomeBpm: 120,
  metronomeOn: false,
  octaveShift: 0,
  activeKeys: [],
  noteHistory: [],
  heatmap: {},
  midiDevices: [],
  selectedMidiDevice: null,
  chordName: '',

  // Recording States
  isRecording: false,
  recordingStartTime: null,
  currentRecordingNotes: [],

  // Scoring States
  currentScore: 0,
  correctNotesCount: 0,
  missedNotesCount: 0,
  streak: 0,
  maxStreak: 0,
  showScoreboard: false,

  // Settings Actions
  setTheme: (theme) => {
    set({ theme });
    setLocalStorage('piano_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  setPianoVolume: (pianoVolume) => {
    set({ pianoVolume });
    setLocalStorage('piano_volume', pianoVolume);
  },
  setSongVolume: (songVolume) => {
    set({ songVolume });
    setLocalStorage('piano_songVolume', songVolume);
  },
  setReverb: (reverb) => {
    set({ reverb });
    setLocalStorage('piano_reverb', reverb);
  },
  setInstrument: (instrument) => {
    set({ instrument });
    setLocalStorage('piano_instrument', instrument);
  },
  setShowLabels: (showLabels) => {
    set({ showLabels });
    setLocalStorage('piano_showLabels', showLabels);
  },
  setChordDetection: (chordDetection) => {
    set({ chordDetection });
    setLocalStorage('piano_chordDetection', chordDetection);
  },
  setScalePractice: (scalePractice) => {
    set({ scalePractice });
    setLocalStorage('piano_scalePractice', scalePractice);
  },
  setScaleRoot: (scaleRoot) => {
    set({ scaleRoot });
    setLocalStorage('piano_scaleRoot', scaleRoot);
  },
  setScaleType: (scaleType) => {
    set({ scaleType });
    setLocalStorage('piano_scaleType', scaleType);
  },
  setFallingSpeed: (fallingSpeed) => {
    set({ fallingSpeed });
    setLocalStorage('piano_fallingSpeed', fallingSpeed);
  },
  updateKeyMap: (computerKey, note) => {
    set((state) => {
      const nextMap = { ...state.keyMap, [computerKey.toLowerCase()]: note };
      setLocalStorage('piano_keymap_v3', nextMap);
      return { keyMap: nextMap };
    });
  },
  resetKeyMapToDefault: () => {
    set({ keyMap: DEFAULT_KEYMAP });
    setLocalStorage('piano_keymap_v3', DEFAULT_KEYMAP);
  },
  toggleFavoriteSong: (songId) => {
    set((state) => {
      const exists = state.favoriteSongIds.includes(songId);
      const nextFavorites = exists
        ? state.favoriteSongIds.filter((id) => id !== songId)
        : [...state.favoriteSongIds, songId];
      setLocalStorage('piano_favorites', nextFavorites);
      return { favoriteSongIds: nextFavorites };
    });
  },
  addCustomSong: (song) => {
    set((state) => {
      const nextSongs = [song, ...state.customSongs];
      setLocalStorage('piano_custom_songs', nextSongs);
      return { customSongs: nextSongs };
    });
  },
  deleteCustomSong: (songId) => {
    set((state) => {
      const nextSongs = state.customSongs.filter((s) => s.id !== songId);
      setLocalStorage('piano_custom_songs', nextSongs);
      return { customSongs: nextSongs };
    });
  },

  // Playback Timeline Actions
  setActiveSong: (activeSong) => {
    set({ activeSong, songTime: 0, isPlayingSong: false });
    get().resetScore();
  },
  setIsPlayingSong: (isPlayingSong) => set({ isPlayingSong }),
  setSongTime: (songTime) => set({ songTime }),
  setSongSpeed: (songSpeed) => set({ songSpeed }),
  setWaitMode: (waitMode) => set({ waitMode }),
  setLoopActive: (loopActive) => set({ loopActive }),
  setShuffleActive: (shuffleActive) => set({ shuffleActive }),
  setSustain: (sustain) => set({ sustain }),
  setMetronomeBpm: (metronomeBpm) => set({ metronomeBpm }),
  setMetronomeOn: (metronomeOn) => set({ metronomeOn }),
  
  setOctaveShift: (shift) => {
    set((state) => {
      const nextShift = typeof shift === 'function' ? shift(state.octaveShift) : shift;
      const clamped = Math.max(-2, Math.min(2, nextShift));
      return { octaveShift: clamped };
    });
  },

  // Interactive Note Actions
  addActiveKey: (key) => set((state) => {
    if (state.activeKeys.includes(key)) return {};
    return { activeKeys: [...state.activeKeys, key] };
  }),

  removeActiveKey: (key) => set((state) => ({
    activeKeys: state.activeKeys.filter((k) => k !== key),
  })),

  clearActiveKeys: () => set({ activeKeys: [] }),

  addNoteToHistory: (note) => set((state) => {
    const newNote = {
      note,
      id: `${note}-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    const nextHistory = [newNote, ...state.noteHistory].slice(0, 50);

    const nextHeatmap = { ...state.heatmap };
    nextHeatmap[note] = (nextHeatmap[note] || 0) + 1;

    return { 
      noteHistory: nextHistory,
      heatmap: nextHeatmap
    };
  }),

  clearHistory: () => set({ noteHistory: [], heatmap: {} }),
  setChordName: (chordName) => set({ chordName }),

  // Scoring Actions
  resetScore: () => set({
    currentScore: 0,
    correctNotesCount: 0,
    missedNotesCount: 0,
    streak: 0,
    maxStreak: 0,
    showScoreboard: false,
  }),

  triggerNoteHit: (_note) => set((state) => {
    const newStreak = state.streak + 1;
    const points = 100 + (newStreak > 5 ? 50 : 0); // streak bonus multiplier
    return {
      currentScore: state.currentScore + points,
      correctNotesCount: state.correctNotesCount + 1,
      streak: newStreak,
      maxStreak: Math.max(state.maxStreak, newStreak),
    };
  }),

  triggerNoteMiss: (_note) => set((state) => ({
    missedNotesCount: state.missedNotesCount + 1,
    streak: 0,
  })),

  setShowScoreboard: (showScoreboard) => set({ showScoreboard }),

  // Device Sync Actions
  setMidiDevices: (midiDevices) => set({ midiDevices }),
  setSelectedMidiDevice: (selectedMidiDevice) => set({ selectedMidiDevice }),

  // Stats Actions
  incrementNotesPlayed: () => {
    set((state) => {
      const nextStats = { ...state.stats, notesPlayed: state.stats.notesPlayed + 1 };
      setLocalStorage('piano_stats', nextStats);
      return { stats: nextStats };
    });
  },

  addPlayTime: (seconds) => {
    set((state) => {
      const nextStats = { ...state.stats, totalPlayTime: state.stats.totalPlayTime + seconds };
      setLocalStorage('piano_stats', nextStats);
      return { stats: nextStats };
    });
  },

  // Recording Actions
  startRecording: () => {
    set({
      isRecording: true,
      recordingStartTime: Date.now(),
      currentRecordingNotes: [],
    });
  },

  stopRecording: (trackName) => {
    const { isRecording, recordingStartTime, currentRecordingNotes, recordedTracks, instrument } = get();
    if (!isRecording || !recordingStartTime) return;

    const duration = Date.now() - recordingStartTime;
    if (currentRecordingNotes.length > 0) {
      const newTrack: RecordedTrack = {
        id: `track-${Date.now()}-${Math.random()}`,
        name: trackName || `Recording #${recordedTracks.length + 1}`,
        date: new Date().toLocaleString(),
        notes: currentRecordingNotes,
        duration,
        instrument,
      };

      const nextTracks = [newTrack, ...recordedTracks];
      set({ recordedTracks: nextTracks });
      setLocalStorage('piano_recorded_tracks', nextTracks);
    }

    set({
      isRecording: false,
      recordingStartTime: null,
      currentRecordingNotes: [],
    });
  },

  recordNote: (note, velocity) => {
    const { isRecording, recordingStartTime } = get();
    if (!isRecording || !recordingStartTime) return;

    const time = Date.now() - recordingStartTime;
    set((state) => ({
      currentRecordingNotes: [
        ...state.currentRecordingNotes,
        { note, time, velocity },
      ],
    }));
  },

  deleteTrack: (id) => {
    set((state) => {
      const nextTracks = state.recordedTracks.filter((track) => track.id !== id);
      setLocalStorage('piano_recorded_tracks', nextTracks);
      return { recordedTracks: nextTracks };
    });
  },
  setActivePage: (activePage) => set({ activePage }),
}));
