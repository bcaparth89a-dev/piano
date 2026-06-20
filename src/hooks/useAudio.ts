import { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import { usePianoStore } from '../store/settings';

// CDN Base URL for tonejs-instruments samples
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments@master/samples/';

// Precise sparse notes map for samplers (minor thirds to allow smooth pitch shifting)
const INSTRUMENT_NOTES: Record<string, Record<string, string>> = {
  piano: {
    'A0': 'A0.mp3', 'C1': 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
    'A1': 'A1.mp3', 'C2': 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
    'A2': 'A2.mp3', 'C3': 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
    'A3': 'A3.mp3', 'C4': 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
    'A4': 'A4.mp3', 'C5': 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
    'A5': 'A5.mp3', 'C6': 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
    'A6': 'A6.mp3', 'C7': 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
    'A7': 'A7.mp3'
  },
  organ: {
    'C1': 'C1.mp3', 'A1': 'A1.mp3', 'C2': 'C2.mp3', 'A2': 'A2.mp3',
    'C3': 'C3.mp3', 'A3': 'A3.mp3', 'C4': 'C4.mp3', 'A4': 'A4.mp3',
    'C5': 'C5.mp3', 'A5': 'A5.mp3', 'C6': 'C6.mp3',
    'D#1': 'Ds1.mp3', 'D#2': 'Ds2.mp3', 'D#3': 'Ds3.mp3', 'D#4': 'Ds4.mp3', 'D#5': 'Ds5.mp3',
    'F#1': 'Fs1.mp3', 'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3', 'F#5': 'Fs5.mp3'
  },
  'guitar-acoustic': {
    'F4': 'F4.mp3', 'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3',
    'G2': 'G2.mp3', 'G3': 'G3.mp3', 'G4': 'G4.mp3', 'A2': 'A2.mp3',
    'A3': 'A3.mp3', 'A4': 'A4.mp3', 'B2': 'B2.mp3', 'B3': 'B3.mp3',
    'B4': 'B4.mp3', 'C3': 'C3.mp3', 'C4': 'C4.mp3', 'C5': 'C5.mp3',
    'D2': 'D2.mp3', 'D3': 'D3.mp3', 'D4': 'D4.mp3', 'D5': 'D5.mp3',
    'E2': 'E2.mp3', 'E3': 'E3.mp3', 'E4': 'E4.mp3'
  },
  'guitar-nylon': {
    'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3', 'F#5': 'Fs5.mp3',
    'G3': 'G3.mp3', 'A2': 'A2.mp3', 'A3': 'A3.mp3', 'A4': 'A4.mp3',
    'A5': 'A5.mp3', 'B1': 'B1.mp3', 'B2': 'B2.mp3', 'B3': 'B3.mp3',
    'B4': 'B4.mp3', 'C#3': 'Cs3.mp3', 'C#4': 'Cs4.mp3', 'C#5': 'Cs5.mp3',
    'D2': 'D2.mp3', 'D3': 'D3.mp3', 'D5': 'D5.mp3', 'E2': 'E2.mp3',
    'E3': 'E3.mp3', 'E4': 'E4.mp3', 'E5': 'E5.mp3'
  },
  'guitar-electric': {
    'D#3': 'Ds3.mp3', 'D#4': 'Ds4.mp3', 'D#5': 'Ds5.mp3', 'E2': 'E2.mp3',
    'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3', 'F#5': 'Fs5.mp3',
    'A2': 'A2.mp3', 'A3': 'A3.mp3', 'A4': 'A4.mp3', 'A5': 'A5.mp3',
    'C3': 'C3.mp3', 'C4': 'C4.mp3', 'C5': 'C5.mp3', 'C6': 'C6.mp3'
  },
  'bass-electric': {
    'A#1': 'As1.mp3', 'A#2': 'As2.mp3', 'A#3': 'As3.mp3', 'A#4': 'As4.mp3',
    'C#1': 'Cs1.mp3', 'C#2': 'Cs2.mp3', 'C#3': 'Cs3.mp3', 'C#4': 'Cs4.mp3',
    'E1': 'E1.mp3', 'E2': 'E2.mp3', 'E3': 'E3.mp3', 'E4': 'E4.mp3',
    'G1': 'G1.mp3', 'G2': 'G2.mp3', 'G3': 'G3.mp3', 'G4': 'G4.mp3'
  },
  violin: {
    'A3': 'A3.mp3', 'A4': 'A4.mp3', 'A5': 'A5.mp3', 'A6': 'A6.mp3',
    'C4': 'C4.mp3', 'C5': 'C5.mp3', 'C6': 'C6.mp3', 'C7': 'C7.mp3',
    'E4': 'E4.mp3', 'E5': 'E5.mp3', 'E6': 'E6.mp3',
    'G4': 'G4.mp3', 'G5': 'G5.mp3', 'G6': 'G6.mp3'
  },
  cello: {
    'C2': 'C2.mp3', 'C3': 'C3.mp3', 'C4': 'C4.mp3', 'C5': 'C5.mp3',
    'D2': 'D2.mp3', 'D3': 'D3.mp3', 'D4': 'D4.mp3',
    'E2': 'E2.mp3', 'E3': 'E3.mp3', 'E4': 'E4.mp3',
    'F2': 'F2.mp3', 'F3': 'F3.mp3', 'F4': 'F4.mp3',
    'G2': 'G2.mp3', 'G3': 'G3.mp3', 'G4': 'G4.mp3',
    'A2': 'A2.mp3', 'A3': 'A3.mp3', 'A4': 'A4.mp3'
  }
};

// Global audio nodes cache
let masterVolume: Tone.Volume | null = null;
let reverbNode: Tone.Reverb | null = null;
let eqNode: Tone.EQ3 | null = null;
let limiterNode: Tone.Limiter | null = null;

// Sampler cache to avoid duplicate instantiations
const samplersCache: Record<string, Tone.Sampler | Tone.PolySynth> = {};

export const useAudio = () => {
  const storeInstrument = usePianoStore((s) => s.instrument);
  const storeVolume = usePianoStore((s) => s.pianoVolume);
  const storeReverb = usePianoStore((s) => s.reverb);
  const storeSustain = usePianoStore((s) => s.sustain);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep track of held notes and sustained notes to manage releases
  const heldNotes = useRef<Set<string>>(new Set());
  const sustainedNotes = useRef<Set<string>>(new Set());

  // Setup Audio Nodes Chain once
  const initAudioNodes = () => {
    if (!masterVolume) {
      limiterNode = new Tone.Limiter(-1).toDestination();
      
      // Volume maps 0..1 to -40dB..0dB (with mute at 0)
      const db = storeVolume === 0 ? -Infinity : Tone.gainToDb(storeVolume);
      masterVolume = new Tone.Volume(db).connect(limiterNode);

      reverbNode = new Tone.Reverb(1.8).connect(masterVolume);
      reverbNode.wet.value = storeReverb;

      eqNode = new Tone.EQ3({
        low: 0,
        mid: 0,
        high: 0,
      }).connect(reverbNode);
    }
  };

  // Helper to trigger loading of samples
  const getInstrumentInstance = (inst: string): Promise<Tone.Sampler | Tone.PolySynth> => {
    initAudioNodes();

    if (samplersCache[inst]) {
      return Promise.resolve(samplersCache[inst]);
    }

    setIsLoading(true);
    setLoadError(null);

    return new Promise((resolve, reject) => {
      // 1. Check if it's a fully synthesized instrument
      if (inst === 'synth') {
        const polySynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.8 },
        }).connect(eqNode!);
        
        samplersCache[inst] = polySynth;
        setIsLoading(false);
        resolve(polySynth);
        return;
      }

      if (inst === 'electric-piano') {
        const epSynth = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 2,
          modulationIndex: 12,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.002, decay: 1.2, sustain: 0.0, release: 1.0 },
          modulation: { type: 'sine' },
          modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0.0, release: 0.5 },
        }).connect(eqNode!);

        samplersCache[inst] = epSynth;
        setIsLoading(false);
        resolve(epSynth);
        return;
      }

      if (inst === 'harpsichord') {
        const harpSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.002, decay: 0.4, sustain: 0.0, release: 0.2 },
        }).connect(eqNode!);
        
        // Connect through a high-pass filter to simulate the plucked strings structure
        const hpFilter = new Tone.Filter(350, 'highpass').connect(eqNode!);
        harpSynth.disconnect();
        harpSynth.connect(hpFilter);

        samplersCache[inst] = harpSynth;
        setIsLoading(false);
        resolve(harpSynth);
        return;
      }

      // 2. Sampled instruments loaded from CDN
      let samplerFolder = inst;
      let notesMap = INSTRUMENT_NOTES[inst];

      // Custom presets built on other samples
      if (inst === 'upright-piano' || inst === 'bright-piano' || inst === 'jazz-piano' || inst === 'honky-tonk') {
        samplerFolder = 'piano';
        notesMap = INSTRUMENT_NOTES['piano'];
      } else if (inst === 'strings') {
        // Strings uses violin/cello combined, we will load violin as default
        samplerFolder = 'violin';
        notesMap = INSTRUMENT_NOTES['violin'];
      }

      if (!notesMap) {
        setIsLoading(false);
        reject(new Error(`Unknown instrument mapping for: ${inst}`));
        return;
      }

      const sampler = new Tone.Sampler({
        urls: notesMap,
        baseUrl: `${CDN_BASE}${samplerFolder}/`,
        onload: () => {
          setIsLoading(false);
          resolve(sampler);
        },
        onerror: (err) => {
          setIsLoading(false);
          setLoadError(`Failed to load samples for ${inst}`);
          reject(err);
        }
      }).connect(eqNode!);

      samplersCache[inst] = sampler;
    });
  };

  // Adjust audio effects nodes based on UI presets
  const applyInstrumentEffects = (inst: string) => {
    if (!eqNode || !reverbNode) return;

    // Reset default EQ
    eqNode.low.value = 0;
    eqNode.mid.value = 0;
    eqNode.high.value = 0;
    
    if (inst === 'upright-piano') {
      // Boxy, warmer sound: boost mids, roll off highs slightly
      eqNode.low.value = 1.5;
      eqNode.mid.value = 2.0;
      eqNode.high.value = -3.0;
    } else if (inst === 'bright-piano') {
      // Bright: boost highs, cut lows
      eqNode.low.value = -2.0;
      eqNode.high.value = 4.0;
    } else if (inst === 'jazz-piano') {
      // Warm, compressed feel: slight boost on low/mids, dynamic presence
      eqNode.low.value = 2.0;
      eqNode.mid.value = 1.0;
      eqNode.high.value = 0.5;
    } else if (inst === 'honky-tonk') {
      // Slightly distorted/detuned vibe, boost highs/lows
      eqNode.low.value = 1.0;
      eqNode.high.value = 3.0;
    }
  };

  // Trigger playing a note
  const playNote = async (note: string, velocity = 0.8) => {
    // Start Audio Context if suspended (user interaction rule)
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    try {
      const inst = await getInstrumentInstance(storeInstrument);
      heldNotes.current.add(note);



      if (inst instanceof Tone.Sampler) {
        // Sampled notes play
        if (storeInstrument === 'honky-tonk') {
          // Trigger double voices for chorus effect
          inst.triggerAttack(note, Tone.now(), velocity * 0.9);
          inst.triggerAttack(note, Tone.now(), velocity * 0.9);
        } else {
          inst.triggerAttack(note, Tone.now(), velocity);
        }
      } else {
        // Synthesizer play
        inst.triggerAttack(note, Tone.now(), velocity);
      }
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };

  // Release a note
  const stopNote = async (note: string) => {
    heldNotes.current.delete(note);

    if (storeSustain) {
      // Keep note in sustained notes map, don't trigger release yet
      sustainedNotes.current.add(note);
      return;
    }

    try {
      const inst = samplersCache[storeInstrument];
      if (inst) {
        inst.triggerRelease(note, Tone.now());
      }
    } catch (e) {
      console.error('Audio stop error:', e);
    }
  };

  // Triggered when sustain pedal is released
  const releaseSustainedNotes = () => {
    try {
      const inst = samplersCache[storeInstrument];
      if (inst) {
        sustainedNotes.current.forEach((note) => {
          // If the note is not currently held down by the user, release it
          if (!heldNotes.current.has(note)) {
            inst.triggerRelease(note, Tone.now());
          }
        });
      }
    } catch (e) {
      console.error('Sustain release error:', e);
    }
    sustainedNotes.current.clear();
  };

  // Sync state stores to audio node parameters
  useEffect(() => {
    initAudioNodes();
    if (masterVolume) {
      const db = storeVolume === 0 ? -Infinity : Tone.gainToDb(storeVolume);
      masterVolume.volume.value = db;
    }
  }, [storeVolume]);

  useEffect(() => {
    initAudioNodes();
    if (reverbNode) {
      reverbNode.wet.value = storeReverb;
    }
  }, [storeReverb]);

  useEffect(() => {
    // When instrument changes, preload the samples
    getInstrumentInstance(storeInstrument).then(() => {
      applyInstrumentEffects(storeInstrument);
    });
  }, [storeInstrument]);

  useEffect(() => {
    // When sustain pedal is toggled off, release all sustained notes
    if (!storeSustain) {
      releaseSustainedNotes();
    }
  }, [storeSustain]);

  return {
    playNote,
    stopNote,
    isLoading,
    loadError,
    preloadInstrument: getInstrumentInstance,
  };
};
