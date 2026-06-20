import React, { useEffect, useRef, useState } from 'react';
import { usePianoStore } from '../store/settings';
import { useAudio } from '../hooks/useAudio';
import { PianoKey } from './PianoKey';
import { shiftNote } from '../hooks/useKeyboard';
import { detectChord, isNoteInScale } from '../utils/chordDetector';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FallingNotesCanvas } from './FallingNotesCanvas';

// Programmatically generate 88 piano keys (A0 to C8)
export interface PianoKeyData {
  note: string;
  pitch: string;
  octave: number;
  isBlack: boolean;
  leftWhiteIndex: number; // Index of the white key immediately to its left
}

export const generate88Keys = (): PianoKeyData[] => {
  const keys: PianoKeyData[] = [];
  let whiteKeyCounter = 0;

  // Octave 0: A0, A#0, B0
  keys.push({ note: 'A0', pitch: 'A', octave: 0, isBlack: false, leftWhiteIndex: whiteKeyCounter++ });
  keys.push({ note: 'A#0', pitch: 'A#', octave: 0, isBlack: true, leftWhiteIndex: whiteKeyCounter - 1 });
  keys.push({ note: 'B0', pitch: 'B', octave: 0, isBlack: false, leftWhiteIndex: whiteKeyCounter++ });

  const pitches = [
    { name: 'C', isBlack: false },
    { name: 'C#', isBlack: true },
    { name: 'D', isBlack: false },
    { name: 'D#', isBlack: true },
    { name: 'E', isBlack: false },
    { name: 'F', isBlack: false },
    { name: 'F#', isBlack: true },
    { name: 'G', isBlack: false },
    { name: 'G#', isBlack: true },
    { name: 'A', isBlack: false },
    { name: 'A#', isBlack: true },
    { name: 'B', isBlack: false },
  ];

  // Octaves 1 to 7
  for (let octave = 1; octave <= 7; octave++) {
    for (const p of pitches) {
      if (p.isBlack) {
        keys.push({
          note: `${p.name}${octave}`,
          pitch: p.name,
          octave,
          isBlack: true,
          leftWhiteIndex: whiteKeyCounter - 1,
        });
      } else {
        keys.push({
          note: `${p.name}${octave}`,
          pitch: p.name,
          octave,
          isBlack: false,
          leftWhiteIndex: whiteKeyCounter++,
        });
      }
    }
  }

  // Octave 8: C8 (last white key)
  keys.push({ note: 'C8', pitch: 'C', octave: 8, isBlack: false, leftWhiteIndex: whiteKeyCounter++ });

  return keys;
};

export const Piano: React.FC = () => {
  const { playNote, stopNote } = useAudio();

  const activeKeys = usePianoStore((s) => s.activeKeys);
  const addActiveKey = usePianoStore((s) => s.addActiveKey);
  const removeActiveKey = usePianoStore((s) => s.removeActiveKey);
  const showLabels = usePianoStore((s) => s.showLabels);
  const octaveShift = usePianoStore((s) => s.octaveShift);
  const chordDetection = usePianoStore((s) => s.chordDetection);
  const scalePractice = usePianoStore((s) => s.scalePractice);
  const scaleRoot = usePianoStore((s) => s.scaleRoot);
  const scaleType = usePianoStore((s) => s.scaleType);
  const isRecording = usePianoStore((s) => s.isRecording);
  const recordNote = usePianoStore((s) => s.recordNote);
  const incrementNotesPlayed = usePianoStore((s) => s.incrementNotesPlayed);
  const setChordName = usePianoStore((s) => s.setChordName);
  const chordName = usePianoStore((s) => s.chordName);
  const keyMap = usePianoStore((s) => s.keyMap);
  const activeSong = usePianoStore((s) => s.activeSong);

  const pianoRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [keys] = useState<PianoKeyData[]>(generate88Keys);
  const whiteKeys = keys.filter((k) => !k.isBlack);
  const blackKeys = keys.filter((k) => k.isBlack);

  // Auto-scroll middle C (C4) into center view on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Approximate position of C4 (which is around white key index 23 out of 52)
      const containerWidth = scrollContainerRef.current.scrollWidth;
      const scrollPos = (20 / 52) * containerWidth - scrollContainerRef.current.clientWidth / 2;
      scrollContainerRef.current.scrollLeft = scrollPos;
    }
  }, []);

  // Recalculate chord name in real-time when activeKeys change
  useEffect(() => {
    if (chordDetection && activeKeys.length >= 3) {
      const name = detectChord(activeKeys);
      setChordName(name);
    } else {
      setChordName('');
    }
  }, [activeKeys, chordDetection]);

  const handleKeyPress = (note: string) => {
    addActiveKey(note);
    playNote(note);
    incrementNotesPlayed();

    if (isRecording) {
      recordNote(note, 0.8);
    }

    // Practice scoring evaluation (Hit Check)
    if (activeSong && activeSong.notes) {
      const songTime = usePianoStore.getState().songTime;
      const triggerNoteHit = usePianoStore.getState().triggerNoteHit;
      const threshold = 250;
      const matchNote = activeSong.notes.find(
        (n) => n.note === note && Math.abs(n.time - songTime) <= threshold && !n.hit && !n.missed
      );

      if (matchNote) {
        matchNote.hit = true;
        triggerNoteHit(note);
      }
    }
  };

  const handleKeyRelease = (note: string) => {
    removeActiveKey(note);
    stopNote(note);
  };

  // Find computer keyboard letter map for key printing
  const getLabelForNote = (note: string) => {
    // Reverse shift to find mapping character
    const reverseShifted = shiftNote(note, -octaveShift);
    const entry = Object.entries(keyMap).find(([, n]) => n === reverseShifted);
    return entry ? entry[0].toUpperCase() : '';
  };

  // Check if note is currently active in the selected practice scale
  const isHighlighted = (note: string) => {
    if (!scalePractice) return false;
    return isNoteInScale(note, scaleRoot, scaleType);
  };

  // Horizontal scroll buttons
  const scrollKeyboard = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.4;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Quick navigation to octave zones
  const jumpToOctave = (octave: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.scrollWidth;
      // White key offset mapping
      const octaveOffsets: Record<number, number> = {
        0: 0,    // A0
        2: 9,    // C2
        4: 23,   // C4 (Middle)
        6: 37,   // C6
        8: 51,   // C8 (Treble)
      };
      
      const targetIndex = octaveOffsets[octave] ?? 23;
      const scrollPos = (targetIndex / 52) * containerWidth - scrollContainerRef.current.clientWidth / 2;
      
      scrollContainerRef.current.scrollTo({
        left: scrollPos,
        behavior: 'smooth',
      });
    }
  };

  // Percentage visual sizing rules for absolute overlay of black keys
  const whiteKeyWidthPercent = 100 / 52; // ~1.923%
  const blackKeyWidthPercent = whiteKeyWidthPercent * 0.65; // Slightly narrower than white key

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-7xl mx-auto px-4 mt-6">
      
      {/* Chord & Scale practice Floating Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-4 px-2 min-h-12 bg-surfaceLight/40 backdrop-blur-md rounded-2xl border border-glassBorderLight px-6 py-2 dark:bg-surfaceDark/40 dark:border-glassBorderDark">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
              Chord Detection
            </span>
            <span className="text-lg font-extrabold text-primaryColor dark:text-cyanColor min-h-7">
              {chordName || 'Play 3+ notes'}
            </span>
          </div>
          {scalePractice && (
            <div className="h-8 border-l border-glassBorderLight dark:border-glassBorderDark" />
          )}
          {scalePractice && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                Practice Guide Scale
              </span>
              <span className="text-sm font-semibold text-textPrimaryLight dark:text-textPrimaryDark">
                {scaleRoot} {scaleType.replace(/([A-Z])/g, ' $1')}
              </span>
            </div>
          )}
        </div>

        {/* Scroll helper octave shortcuts */}
        <div className="flex items-center space-x-1.5 text-xs font-semibold">
          <span className="text-textSecondaryLight dark:text-textSecondaryDark/75 mr-2">Jump to:</span>
          <button onClick={() => jumpToOctave(0)} className="px-2 py-1 bg-surfaceLight border border-glassBorderLight dark:bg-surfaceDark dark:border-glassBorderDark rounded-lg hover:text-primaryColor dark:hover:text-cyanColor transition-colors">Bass</button>
          <button onClick={() => jumpToOctave(4)} className="px-2 py-1 bg-surfaceLight border border-glassBorderLight dark:bg-surfaceDark dark:border-glassBorderDark rounded-lg hover:text-primaryColor dark:hover:text-cyanColor transition-colors">Middle</button>
          <button onClick={() => jumpToOctave(8)} className="px-2 py-1 bg-surfaceLight border border-glassBorderLight dark:bg-surfaceDark dark:border-glassBorderDark rounded-lg hover:text-primaryColor dark:hover:text-cyanColor transition-colors">Treble</button>
        </div>
      </div>

      {/* Piano scroll boundary wrapping */}
      <div className="relative w-full rounded-2xl shadow-2xl bg-surfaceLight dark:bg-surfaceDark overflow-hidden border border-glassBorderLight dark:border-glassBorderDark p-4">
        
        {/* Navigation scroll arrows */}
        <button
          onClick={() => scrollKeyboard('left')}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-black/60 shadow-lg border border-glassBorderLight dark:border-glassBorderDark text-textPrimaryLight dark:text-textPrimaryDark backdrop-blur-md opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
        >
          <FiChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={() => scrollKeyboard('right')}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-black/60 shadow-lg border border-glassBorderLight dark:border-glassBorderDark text-textPrimaryLight dark:text-textPrimaryDark backdrop-blur-md opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
        >
          <FiChevronRight className="h-6 w-6" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto select-none overflow-y-hidden"
        >
          {/* Main Key Container (fixed width to prevent cramped keys on small screens) */}
          <div
            ref={pianoRef}
            className="relative flex flex-col select-none min-w-[1250px] w-full transition-all duration-300"
          >
            {activeSong && (
              <div className="w-full mb-3 rounded-xl overflow-hidden border border-glassBorderLight dark:border-glassBorderDark shadow-inner">
                <FallingNotesCanvas />
              </div>
            )}
            
            <div className="relative flex select-none w-full h-[320px]">
              {/* White Keys */}
              {whiteKeys.map((key) => (
              <PianoKey
                key={key.note}
                note={key.note}
                isBlack={false}
                isActive={activeKeys.includes(key.note)}
                isHighlighted={isHighlighted(key.note)}
                label={getLabelForNote(key.note)}
                showLabels={showLabels}
                onPress={handleKeyPress}
                onRelease={handleKeyRelease}
              />
            ))}

            {/* Black Keys Absolute Overlay */}
            {blackKeys.map((key) => {
              // Left alignment is calculated dynamically relative to its left white key index
              const leftOffset = `${(key.leftWhiteIndex + 1) * whiteKeyWidthPercent - blackKeyWidthPercent / 2}%`;
              const widthOffset = `${blackKeyWidthPercent}%`;

              return (
                <PianoKey
                  key={key.note}
                  note={key.note}
                  isBlack={true}
                  isActive={activeKeys.includes(key.note)}
                  isHighlighted={isHighlighted(key.note)}
                  label={getLabelForNote(key.note)}
                  showLabels={showLabels}
                  onPress={handleKeyPress}
                  onRelease={handleKeyRelease}
                  leftOffset={leftOffset}
                  widthOffset={widthOffset}
                />
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Piano;
