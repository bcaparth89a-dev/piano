import React, { useState, useEffect } from 'react';
import { usePianoStore } from '../store/settings';
import { FiRefreshCw, FiEdit2, FiAlertCircle } from 'react-icons/fi';

const NOTES_LIST_MAPPABLE = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5'
];

export const KeyboardRemapper: React.FC = () => {
  const keyMap = usePianoStore((s) => s.keyMap);
  const updateKeyMap = usePianoStore((s) => s.updateKeyMap);
  const resetKeyMapToDefault = usePianoStore((s) => s.resetKeyMapToDefault);

  const [listeningNote, setListeningNote] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Setup global event listener during the 'listening' state
  useEffect(() => {
    if (!listeningNote) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const pressedKey = e.key.toLowerCase();

      // Avoid listening to modifiers like Shift, Ctrl, Alt
      if (pressedKey === 'shift' || pressedKey === 'control' || pressedKey === 'alt' || pressedKey === 'meta') {
        return;
      }

      // Check if key is already mapped to another note
      const existingNote = Object.entries(keyMap).find(
        ([key, note]) => key === pressedKey && note !== listeningNote
      );

      if (existingNote) {
        setDuplicateWarning(`"${pressedKey.toUpperCase()}" is already mapped to ${existingNote[1]}. Key was reassigned!`);
        setTimeout(() => setDuplicateWarning(null), 4000);
      }

      // Update mapping in Zustand store
      updateKeyMap(pressedKey, listeningNote);
      setListeningNote(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [listeningNote, keyMap, updateKeyMap]);

  // Reverse mapping to find computer key for a note
  const getKeyForNote = (note: string): string => {
    const entry = Object.entries(keyMap).find(([, val]) => val === note);
    return entry ? entry[0].toUpperCase() : 'None';
  };

  return (
    <div className="flex flex-col p-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 rounded-2xl border border-glassBorderLight dark:border-glassBorderDark shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
            Remap Controls
          </span>
          <span className="text-sm font-bold text-textPrimaryLight dark:text-textPrimaryDark">
            Keyboard Binding Map
          </span>
        </div>

        <button
          onClick={resetKeyMapToDefault}
          className="flex items-center space-x-1 text-xs font-bold text-primaryColor dark:text-cyanColor hover:opacity-85 transition-opacity"
          title="Reset keys back to default mapping"
        >
          <FiRefreshCw />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Duplicate warning notification */}
      {duplicateWarning && (
        <div className="mb-3 text-[10px] font-semibold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1.5 rounded-lg flex items-center animate-pulse">
          <FiAlertCircle className="mr-1.5 h-3.5 w-3.5" />
          <span>{duplicateWarning}</span>
        </div>
      )}

      <p className="text-[10px] text-textSecondaryLight dark:text-textSecondaryDark/50 mb-3.5 leading-relaxed">
        Click on any note cell below, then press any character on your computer keyboard to bind it.
      </p>

      {/* Grid of keys remapper slots */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto pr-1">
        {NOTES_LIST_MAPPABLE.map((note) => {
          const currentBind = getKeyForNote(note);
          const isListening = listeningNote === note;
          const isBlack = note.includes('#');

          return (
            <button
              key={note}
              onClick={() => {
                setListeningNote(note);
                setDuplicateWarning(null);
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all duration-200
                ${isListening
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 animate-pulse scale-95 ring-2 ring-yellow-500/25'
                  : isBlack
                    ? 'border-gray-800 bg-gray-900 text-cyanColor hover:bg-gray-800'
                    : 'border-glassBorderLight bg-surfaceLight text-primaryColor hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark/60 dark:hover:bg-glassHoverDark'
                }
              `}
            >
              <span className="text-[9px] font-bold text-textSecondaryLight/80 dark:text-textSecondaryDark/40 uppercase mb-0.5 leading-none">
                {note}
              </span>
              <span className="text-xs font-black flex items-center leading-none">
                {isListening ? '...' : currentBind}
                {!isListening && <FiEdit2 className="ml-1 h-2 w-2 opacity-30" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default KeyboardRemapper;
