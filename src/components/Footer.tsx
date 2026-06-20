import React from 'react';
import { usePianoStore } from '../store/settings';

export const Footer: React.FC = () => {
  const setActivePage = usePianoStore((s) => s.setActivePage);

  return (
    <footer className="w-full py-8 border-t border-glassBorderLight bg-surfaceLight/50 dark:border-[#141A24]/40 dark:bg-[#0B0F19]/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 flex justify-center items-center">
        <button
          onClick={() => setActivePage('developer')}
          className="group relative inline-flex items-center justify-center text-sm font-bold text-textPrimaryLight dark:text-textPrimaryDark transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-1.5 cursor-pointer">
            Made with <span className="text-[#C5A059] animate-pulse">❤️</span> by{' '}
            <span className="underline decoration-[#C5A059] transition-all duration-300 text-transparent bg-clip-text bg-gradient-to-r from-textPrimaryLight to-[#C5A059] dark:from-textPrimaryDark dark:to-[#C5A059] font-extrabold">
              Parth Pawar
            </span>
          </span>
        </button>
      </div>
    </footer>
  );
};
export default Footer;
