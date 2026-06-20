import { useEffect, useRef } from 'react';
import { usePianoStore } from '../store/settings';

// Shift octave of a note string (e.g. C4 + 1 -> C5)
export const shiftNote = (note: string, octaves: number): string => {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return note;
  const [, pitch, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const shiftedOctave = octave + octaves;
  // Clamp between A0 (octave 0) and C8 (octave 8)
  const clampedOctave = Math.max(0, Math.min(8, shiftedOctave));
  return `${pitch}${clampedOctave}`;
};

export const useKeyboard = (
  playNote: (note: string, velocity?: number) => void,
  stopNote: (note: string) => void
) => {
  const keyMap = usePianoStore((s) => s.keyMap);
  const octaveShift = usePianoStore((s) => s.octaveShift);
  const setOctaveShift = usePianoStore((s) => s.setOctaveShift);
  const setSustain = usePianoStore((s) => s.setSustain);
  const addActiveKey = usePianoStore((s) => s.addActiveKey);
  const removeActiveKey = usePianoStore((s) => s.removeActiveKey);
  const isRecording = usePianoStore((s) => s.isRecording);
  const recordNote = usePianoStore((s) => s.recordNote);
  const incrementNotesPlayed = usePianoStore((s) => s.incrementNotesPlayed);
  
  // Scoring events triggers
  const activeSong = usePianoStore((s) => s.activeSong);
  const triggerNoteHit = usePianoStore((s) => s.triggerNoteHit);
  const songTime = usePianoStore((s) => s.songTime);

  // Set to keep track of currently active physical keys to prevent repeat events
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if the user is typing in a form input/input fields
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      // Avoid repeating triggers when key is held down
      if (e.repeat) return;

      const key = e.key.toLowerCase();

      // Spacebar toggles sustain pedal
      if (e.code === 'Space') {
        e.preventDefault();
        setSustain(true);
        return;
      }

      // Octave Shift Down (Z)
      if (key === 'z') {
        setOctaveShift((prev) => prev - 1);
        return;
      }

      // Octave Shift Up (X)
      if (key === 'x') {
        setOctaveShift((prev) => prev + 1);
        return;
      }

      // Map key to note dynamically using local store mapping
      const baseNote = keyMap[key];
      if (baseNote) {
        const shiftedNote = shiftNote(baseNote, octaveShift);
        keysPressed.current.add(key);
        
        // Trigger visual state in store
        addActiveKey(shiftedNote);
        
        // Play audio
        playNote(shiftedNote);

        // Record notes if enabled
        if (isRecording) {
          recordNote(shiftedNote, 0.8);
        }

        // Stats track
        incrementNotesPlayed();

        // Practice scoring evaluation (Hit Check)
        if (activeSong && activeSong.notes) {
          // Look for matching note within 250ms of current play time
          const threshold = 250;
          const matchNote = activeSong.notes.find(
            (n) => n.note === shiftedNote && Math.abs(n.time - songTime) <= threshold && !n.hit && !n.missed
          );

          if (matchNote) {
            matchNote.hit = true;
            triggerNoteHit(shiftedNote);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      const key = e.key.toLowerCase();

      // Spacebar releases sustain pedal
      if (e.code === 'Space') {
        e.preventDefault();
        setSustain(false);
        return;
      }

      const baseNote = keyMap[key];
      if (baseNote) {
        const shiftedNote = shiftNote(baseNote, octaveShift);
        keysPressed.current.delete(key);
        
        // Trigger visual release in store
        removeActiveKey(shiftedNote);
        
        // Trigger audio stop
        stopNote(shiftedNote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [octaveShift, keyMap, playNote, stopNote, isRecording, recordNote, activeSong, songTime, triggerNoteHit]);
};

export default useKeyboard;
