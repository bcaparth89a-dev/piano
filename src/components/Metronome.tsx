import React, { useState, useRef } from 'react';
import { usePianoStore } from '../store/settings';
import { useMetronome } from '../hooks/useMetronome';
import { FiPlay, FiSquare, FiActivity, FiMinus, FiPlus } from 'react-icons/fi';

export const Metronome: React.FC = () => {
  const bpm = usePianoStore((s) => s.metronomeBpm);
  const setBpm = usePianoStore((s) => s.setMetronomeBpm);
  const metronomeOn = usePianoStore((s) => s.metronomeOn);
  const setMetronomeOn = usePianoStore((s) => s.setMetronomeOn);

  const [activeBeat, setActiveBeat] = useState(-1);
  const tapTimes = useRef<number[]>([]);

  // Hook up scheduler callbacks
  useMetronome((beat) => {
    setActiveBeat(beat);
  });

  const handleToggle = () => {
    if (metronomeOn) {
      setMetronomeOn(false);
      setActiveBeat(-1);
    } else {
      setMetronomeOn(true);
    }
  };

  const adjustBpm = (amount: number) => {
    const nextBpm = Math.max(40, Math.min(240, bpm + amount));
    setBpm(nextBpm);
  };

  // Tap-tempo calculations
  const handleTapTempo = () => {
    const now = Date.now();
    tapTimes.current.push(now);

    // Keep only last 5 taps
    if (tapTimes.current.length > 5) {
      tapTimes.current.shift();
    }

    if (tapTimes.current.length >= 2) {
      const diffs = [];
      for (let i = 1; i < tapTimes.current.length; i++) {
        diffs.push(tapTimes.current[i] - tapTimes.current[i - 1]);
      }
      
      const averageDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      // Convert milliseconds per beat to Beats Per Minute
      const calculatedBpm = Math.round(60000 / averageDiff);
      
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
      }
    }
  };

  return (
    <div className="flex flex-col p-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 rounded-2xl border border-glassBorderLight dark:border-glassBorderDark shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
            Metronome
          </span>
          <span className="text-xl font-extrabold text-textPrimaryLight dark:text-textPrimaryDark">
            {bpm} <span className="text-xs font-semibold text-textSecondaryLight dark:text-textSecondaryDark/50">BPM</span>
          </span>
        </div>

        {/* 4 Beat Flashing LEDs */}
        <div className="flex space-x-1.5 px-3 py-2 rounded-lg bg-surfaceLight border border-glassBorderLight dark:bg-surfaceDark/80 dark:border-glassBorderDark">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-75
                ${activeBeat === index 
                  ? index === 0 
                    ? 'bg-primaryColor shadow-[0_0_8px_#C5A059]' 
                    : 'bg-cyanColor shadow-[0_0_8px_#D4AF37]'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* BPM Adjuster slider & buttons */}
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={() => adjustBpm(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-glassBorderLight bg-surfaceLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark"
        >
          <FiMinus className="h-4 w-4" />
        </button>

        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-primaryColor dark:accent-cyanColor focus:outline-none"
          style={{
            background: `linear-gradient(to right, #C5A059 0%, #C5A059 ${(bpm - 40) / 200 * 100}%, rgba(156, 163, 175, 0.2) ${(bpm - 40) / 200 * 100}%, rgba(156, 163, 175, 0.2) 100%)`
          }}
        />

        <button
          onClick={() => adjustBpm(1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-glassBorderLight bg-surfaceLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark"
        >
          <FiPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Main triggers */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleToggle}
          className={`flex h-10 items-center justify-center rounded-xl border text-sm font-bold shadow-md transition-all duration-200
            ${metronomeOn
              ? 'bg-gradient-to-r from-red-500 to-rose-600 border-transparent text-white ring-2 ring-red-500/30'
              : 'border-glassBorderLight bg-surfaceLight text-textPrimaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark dark:hover:bg-glassHoverDark'
            }
          `}
        >
          {metronomeOn ? (
            <>
              <FiSquare className="mr-1.5 h-4 w-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <FiPlay className="mr-1.5 h-4 w-4" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={handleTapTempo}
          title="Tap along with your tempo to set BPM automatically"
          className="flex h-10 items-center justify-center rounded-xl border border-glassBorderLight bg-surfaceLight text-textSecondaryLight text-sm font-bold shadow-md hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-all duration-200"
        >
          <FiActivity className="mr-1.5 h-4 w-4 text-cyanColor animate-pulse" />
          <span>Tap Tempo</span>
        </button>
      </div>
    </div>
  );
};
export default Metronome;
