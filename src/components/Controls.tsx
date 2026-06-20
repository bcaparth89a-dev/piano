import React from 'react';
import { usePianoStore } from '../store/settings';
import { VolumeSlider } from './VolumeSlider';
import { InstrumentSelector } from './InstrumentSelector';
import { FiChevronLeft, FiChevronRight, FiCheckSquare, FiSquare, FiLayers } from 'react-icons/fi';
import { SCALES } from '../utils/chordDetector';

interface ControlsProps {
  isLoadingAudio: boolean;
}

const NOTE_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const Controls: React.FC<ControlsProps> = ({ isLoadingAudio }) => {
  const reverb = usePianoStore((s) => s.reverb);
  const setReverb = usePianoStore((s) => s.setReverb);

  const sustain = usePianoStore((s) => s.sustain);
  const setSustain = usePianoStore((s) => s.setSustain);

  const octaveShift = usePianoStore((s) => s.octaveShift);
  const setOctaveShift = usePianoStore((s) => s.setOctaveShift);

  const showLabels = usePianoStore((s) => s.showLabels);
  const setShowLabels = usePianoStore((s) => s.setShowLabels);

  const chordDetection = usePianoStore((s) => s.chordDetection);
  const setChordDetection = usePianoStore((s) => s.setChordDetection);

  const scalePractice = usePianoStore((s) => s.scalePractice);
  const setScalePractice = usePianoStore((s) => s.setScalePractice);

  const scaleRoot = usePianoStore((s) => s.scaleRoot);
  const setScaleRoot = usePianoStore((s) => s.setScaleRoot);

  const scaleType = usePianoStore((s) => s.scaleType);
  const setScaleType = usePianoStore((s) => s.setScaleType);

  const handleOctaveChange = (dir: 'down' | 'up') => {
    setOctaveShift((prev) => (dir === 'down' ? prev - 1 : prev + 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-glassBorderLight bg-surfaceLight/50 p-6 shadow-xl dark:border-glassBorderDark dark:bg-surfaceDark/50 backdrop-blur-lg lg:grid-cols-3 transition-colors duration-300">
        
        {/* Column 1: Instrument & Master Volume */}
        <div className="flex flex-col space-y-5 justify-center border-b border-glassBorderLight pb-6 dark:border-glassBorderDark lg:border-b-0 lg:pb-0 lg:border-r lg:pr-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <InstrumentSelector />
            
            {/* Audio Preloading Spinner */}
            {isLoadingAudio && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-primaryColor/10 to-cyanColor/10 px-3 py-1.5 rounded-lg border border-primaryColor/20 animate-pulse text-xs text-primaryColor dark:text-cyanColor font-semibold">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading samples...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <VolumeSlider />
            
            {/* Reverb Slider */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                <span>Reverb</span>
                <span>{Math.round(reverb * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={reverb}
                onChange={(e) => setReverb(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-primaryColor dark:accent-cyanColor focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #C5A059 0%, #C5A059 ${reverb * 100}%, rgba(156, 163, 175, 0.2) ${reverb * 100}%, rgba(156, 163, 175, 0.2) 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Sustain & Octave Settings */}
        <div className="flex flex-col space-y-5 justify-center border-b border-glassBorderLight pb-6 dark:border-glassBorderDark lg:border-b-0 lg:pb-0 lg:border-r lg:px-6">
          <div className="flex items-center justify-between gap-6">
            
            {/* Sustain Pedal Toggle */}
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                Sustain Pedal
              </span>
              <button
                onClick={() => setSustain(!sustain)}
                className={`flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-bold shadow-md transition-all duration-200
                  ${sustain
                    ? 'bg-gradient-to-r from-primaryColor to-cyanColor border-transparent text-white ring-2 ring-primaryColor/30'
                    : 'border-glassBorderLight bg-surfaceLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark'
                  }
                `}
              >
                <span>Sustain (Space)</span>
              </button>
            </div>

            {/* Octave Shifter */}
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                Octave Shift
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={octaveShift <= -2}
                  onClick={() => handleOctaveChange('down')}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-glassBorderLight bg-surfaceLight text-textSecondaryLight hover:bg-glassHoverLight disabled:opacity-30 disabled:pointer-events-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex flex-col items-center justify-center min-w-12 h-10 px-2 rounded-lg border border-glassBorderLight bg-surfaceLight/80 text-sm font-extrabold text-textPrimaryLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark">
                  <span>{octaveShift > 0 ? `+${octaveShift}` : octaveShift}</span>
                  <span className="text-[8px] font-bold text-textSecondaryLight dark:text-textSecondaryDark/50 uppercase">Z/X</span>
                </div>
                <button
                  disabled={octaveShift >= 2}
                  onClick={() => handleOctaveChange('up')}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-glassBorderLight bg-surfaceLight text-textSecondaryLight hover:bg-glassHoverLight disabled:opacity-30 disabled:pointer-events-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Toggle Swatches */}
          <div className="flex items-center space-x-6 text-sm font-semibold text-textSecondaryLight dark:text-textSecondaryDark/80">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center space-x-1.5 hover:text-textPrimaryLight dark:hover:text-textPrimaryDark transition-colors"
            >
              {showLabels ? <FiCheckSquare className="text-primaryColor dark:text-cyanColor h-4.5 w-4.5" /> : <FiSquare className="h-4.5 w-4.5" />}
              <span>Key Labels</span>
            </button>

            <button
              onClick={() => setChordDetection(!chordDetection)}
              className="flex items-center space-x-1.5 hover:text-textPrimaryLight dark:hover:text-textPrimaryDark transition-colors"
            >
              {chordDetection ? <FiCheckSquare className="text-primaryColor dark:text-cyanColor h-4.5 w-4.5" /> : <FiSquare className="h-4.5 w-4.5" />}
              <span>Chords Overlay</span>
            </button>
          </div>
        </div>

        {/* Column 3: Scale Practice Assistant */}
        <div className="flex flex-col space-y-4 justify-center lg:pl-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
              Scale Practice Guide
            </span>
            <button
              onClick={() => setScalePractice(!scalePractice)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200
                ${scalePractice
                  ? 'bg-accentColor/10 text-accentColor border border-accentColor/30 ring-1 ring-accentColor/20'
                  : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                }
              `}
            >
              <FiLayers className="h-3 w-3" />
              <span>{scalePractice ? 'ACTIVE' : 'INACTIVE'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Scale Root Note Picker */}
            <div className="flex flex-col">
              <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-textSecondaryLight/80 dark:text-textSecondaryDark/40">
                Root Note
              </span>
              <select
                disabled={!scalePractice}
                value={scaleRoot}
                onChange={(e) => setScaleRoot(e.target.value)}
                className="h-9 px-2 rounded-lg border border-glassBorderLight bg-surfaceLight text-xs font-bold text-textPrimaryLight disabled:opacity-40 disabled:pointer-events-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark focus:outline-none focus:border-primaryColor dark:focus:border-cyanColor"
              >
                {NOTE_ROOTS.map((root) => (
                  <option key={root} value={root}>{root}</option>
                ))}
              </select>
            </div>

            {/* Scale Type Picker */}
            <div className="flex flex-col">
              <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-textSecondaryLight/80 dark:text-textSecondaryDark/40">
                Scale Type
              </span>
              <select
                disabled={!scalePractice}
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value)}
                className="h-9 px-2 rounded-lg border border-glassBorderLight bg-surfaceLight text-xs font-bold text-textPrimaryLight disabled:opacity-40 disabled:pointer-events-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark focus:outline-none focus:border-primaryColor dark:focus:border-cyanColor"
              >
                {Object.entries(SCALES).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <p className="text-[10px] leading-relaxed text-textSecondaryLight dark:text-textSecondaryDark/50">
            {scalePractice 
              ? 'Highlighted keys show the scale notes on the keyboard to help you practice fingering, chords, and scales.'
              : 'Turn on to highlight notes belonging to specific major, minor, or pentatonic scales.'
            }
          </p>
        </div>

      </div>
    </div>
  );
};
export default Controls;
