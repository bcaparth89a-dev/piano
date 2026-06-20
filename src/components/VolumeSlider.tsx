import React, { useState } from 'react';
import { FiVolume2, FiVolumeX, FiVolume1 } from 'react-icons/fi';
import { usePianoStore } from '../store/settings';

export const VolumeSlider: React.FC = () => {
  const volume = usePianoStore((s) => s.pianoVolume);
  const setVolume = usePianoStore((s) => s.setPianoVolume);
  
  const [previousVolume, setPreviousVolume] = useState(0.8);

  const handleToggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <FiVolumeX className="h-5 w-5" />;
    if (volume < 0.4) return <FiVolume1 className="h-5 w-5" />;
    return <FiVolume2 className="h-5 w-5" />;
  };

  return (
    <div className="flex items-center space-x-3 w-full max-w-[200px]">
      <button
        onClick={handleToggleMute}
        title={volume === 0 ? 'Unmute master volume' : 'Mute master volume'}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-glassBorderLight bg-surfaceLight/50 text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark/50 dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
      >
        {getVolumeIcon()}
      </button>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-primaryColor dark:accent-cyanColor focus:outline-none"
          style={{
            background: `linear-gradient(to right, #C5A059 0%, #C5A059 ${volume * 100}%, rgba(156, 163, 175, 0.2) ${volume * 100}%, rgba(156, 163, 175, 0.2) 100%)`
          }}
        />
      </div>
    </div>
  );
};
export default VolumeSlider;
