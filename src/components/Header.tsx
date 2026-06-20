import React, { useState } from 'react';
import { FiSun, FiMoon, FiMaximize, FiMinimize, FiHelpCircle, FiTrendingUp } from 'react-icons/fi';
import { usePianoStore } from '../store/settings';

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, onOpenStats }) => {
  const theme = usePianoStore((s) => s.theme);
  const setTheme = usePianoStore((s) => s.setTheme);
  const midiDevices = usePianoStore((s) => s.midiDevices);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glassBorderLight bg-surfaceLight/80 backdrop-blur-md dark:border-glassBorderDark dark:bg-surfaceDark/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-black/10 border border-glassBorderLight dark:border-[#27272a] flex items-center justify-center shadow-md">
            <img 
              src="/Logo.png" 
              alt="RaagAnubhuti Logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('header-logo-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              id="header-logo-fallback" 
              className="hidden absolute inset-0 items-center justify-center bg-gradient-to-tr from-[#C5A059] to-[#D4AF37] text-black text-xs font-black"
            >
              RA
            </div>
          </div>
          <div>
            <h1 className="my-0 text-lg font-black tracking-tight text-textPrimaryLight dark:text-textPrimaryDark font-sans leading-none flex items-baseline gap-1.5">
              <span>RaagAnubhuti</span>
              <span className="text-xs font-bold text-[#C5A059] tracking-normal font-sans">(રાગઅનુભૂતિ)</span>
            </h1>
            <p className="hidden text-[9px] font-bold text-textSecondaryLight dark:text-textSecondaryDark/50 uppercase tracking-widest mt-0.5 sm:block">
              Interactive Concert Grand
            </p>
          </div>
        </div>

        {/* Center: MIDI Status Indicator */}
        <div className="hidden items-center space-x-2 rounded-full border border-glassBorderLight px-3 py-1 text-xs dark:border-glassBorderDark md:flex">
          <div className={`h-2.5 w-2.5 rounded-full ${midiDevices.length > 0 ? 'bg-accentColor animate-ping' : 'bg-textSecondaryDark/50'}`} />
          <span className="text-textSecondaryLight dark:text-textSecondaryDark font-medium">
            {midiDevices.length > 0 ? `MIDI Connected: ${midiDevices[0]}` : 'MIDI Devices Autodetected'}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Practice Stats Toggle */}
          <button
            onClick={onOpenStats}
            title="Practice Statistics"
            className="flex h-9 items-center justify-center rounded-lg border border-glassBorderLight px-3 text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
          >
            <FiTrendingUp className="mr-1.5 h-4.5 w-4.5" />
            <span className="text-sm font-semibold">Stats</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-glassBorderLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
          >
            {theme === 'dark' ? <FiSun className="h-4.5 w-4.5" /> : <FiMoon className="h-4.5 w-4.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-glassBorderLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
          >
            {isFullscreen ? <FiMinimize className="h-4.5 w-4.5" /> : <FiMaximize className="h-4.5 w-4.5" />}
          </button>

          {/* Help/Keyboard shortcuts */}
          <button
            onClick={onOpenHelp}
            title="Keyboard Shortcuts Map"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-glassBorderLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark transition-colors duration-200"
          >
            <FiHelpCircle className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
