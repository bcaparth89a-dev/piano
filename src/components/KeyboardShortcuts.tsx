import React from 'react';
import { FiX, FiInfo, FiSliders } from 'react-icons/fi';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS_LIST = [
  { key: 'A', note: 'C4 (Middle C)' },
  { key: 'W', note: 'C#4' },
  { key: 'S', note: 'D4' },
  { key: 'E', note: 'D#4' },
  { key: 'D', note: 'E4' },
  { key: 'F', note: 'F4' },
  { key: 'T', note: 'F#4' },
  { key: 'G', note: 'G4' },
  { key: 'Y', note: 'G#4' },
  { key: 'H', note: 'A4' },
  { key: 'U', note: 'A#4' },
  { key: 'J', note: 'B4' },
  { key: 'K', note: 'C5' },
  { key: 'O', note: 'C#5' },
  { key: 'L', note: 'D5' },
  { key: 'P', note: 'D#5' },
  { key: ';', note: 'E5' },
  { key: "'", note: 'F5' },
];

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-glassBorderLight bg-white p-6 shadow-2xl dark:border-glassBorderDark dark:bg-surfaceDark max-h-[90vh] overflow-y-auto transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-glassBorderLight pb-3 dark:border-glassBorderDark">
          <div className="flex items-center space-x-2">
            <FiInfo className="text-primaryColor dark:text-cyanColor h-5 w-5" />
            <h3 className="text-base font-bold text-textPrimaryLight dark:text-textPrimaryDark">
              Piano Guide & Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-glassBorderLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4 space-y-5 text-sm text-textSecondaryLight dark:text-textSecondaryDark">
          
          {/* Note Mapping Grid */}
          <div>
            <h4 className="font-bold text-textPrimaryLight dark:text-textPrimaryDark mb-2 flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-primaryColor mr-2" /> Keyboard Mapping
            </h4>
            <p className="text-xs mb-3">
              Press these characters on your computer keyboard to trigger note playbacks:
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {SHORTCUTS_LIST.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
                >
                  <span className="font-extrabold text-xs text-primaryColor dark:text-cyanColor bg-white px-2 py-0.5 rounded border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    {item.key}
                  </span>
                  <span className="text-xs font-semibold">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Functions */}
          <div>
            <h4 className="font-bold text-textPrimaryLight dark:text-textPrimaryDark mb-2 flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-primaryColor mr-2" /> Function Keys
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <span className="font-bold text-xs text-textPrimaryLight dark:text-textPrimaryDark">
                  Space Bar
                </span>
                <span className="text-xs font-semibold text-right">Hold down to engage Sustain Pedal</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <span className="font-bold text-xs text-textPrimaryLight dark:text-textPrimaryDark">
                  Z / X Keys
                </span>
                <span className="text-xs font-semibold text-right">Shift Keyboard Octave Down (Z) / Up (X)</span>
              </div>
            </div>
          </div>

          {/* Practice tips */}
          <div className="p-3 bg-gradient-to-r from-primaryColor/5 to-cyanColor/5 rounded-xl border border-primaryColor/10 text-xs">
            <h5 className="font-bold text-textPrimaryLight dark:text-textPrimaryDark mb-1 flex items-center">
              <FiSliders className="mr-1.5 text-primaryColor dark:text-cyanColor" /> Pro Tips:
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-textSecondaryLight dark:text-textSecondaryDark/80">
              <li>Enable <span className="font-bold">Scale Practice Guide</span> in controls to visually highlight notes in standard scales.</li>
              <li>Plug in a USB MIDI Keyboard to trigger realistic velocity responses.</li>
              <li>Slide your mouse or swipe across touch screens for smooth glissando effects.</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-primaryColor to-cyanColor rounded-xl text-white font-bold hover:opacity-90 shadow-md text-xs"
          >
            Got it, Let's Play!
          </button>
        </div>
        
      </div>
    </div>
  );
};
export default KeyboardShortcuts;
