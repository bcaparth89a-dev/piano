import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Progress bar simulation (takes ~2.5s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // Auto fade-out timing
    const timeout = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation to complete before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  // Handle manual skip
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Letter stagger animation variants for title "RaagAnubhuti"
  const titleLetters = Array.from("RaagAnubhuti");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 10 }
    },
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100,
            scale: 0.95,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-[#07080b] via-[#0f111a] to-[#040507] text-zinc-100 p-8 overflow-hidden select-none"
        >
          {/* Ambient Glowing Background Elements */}
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

          {/* Top Skip Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="w-full flex justify-end relative z-10"
          >
            <button
              onClick={handleSkip}
              className="px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Skip Intro
            </button>
          </motion.div>

          {/* Center Branding Content */}
          <div className="flex flex-col items-center justify-center space-y-8 relative z-10 flex-1">
            {/* Logo Wrapper with Outer Glowing Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 70, 
                damping: 15,
                duration: 1.2 
              }}
              className="relative group"
            >
              {/* Outer Golden Halo */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] opacity-25 blur-xl group-hover:opacity-40 transition-opacity duration-1000 animate-pulse" />
              
              {/* Elegant Logo Border */}
              <div className="relative p-2.5 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                <img
                  src="/Logo.png"
                  alt="RaagAnubhuti Logo"
                  className="h-28 w-28 md:h-36 md:w-36 object-contain rounded-2xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                  onError={(e) => {
                    // Fallback to inline SVG/Icon placeholder if Logo.png fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const placeholder = document.getElementById('logo-fallback');
                      if (placeholder) placeholder.style.display = 'flex';
                    }
                  }}
                />
                
                {/* Fallback element */}
                <div 
                  id="logo-fallback" 
                  className="hidden h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#D4AF37]"
                >
                  <span className="text-4xl text-black font-extrabold">RA</span>
                </div>
              </div>
            </motion.div>

            {/* Title Section */}
            <div className="text-center space-y-3">
              {/* Staggered English Title */}
              <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="my-0 text-4xl md:text-5xl font-black tracking-tight text-white font-sans flex justify-center items-center"
              >
                {titleLetters.map((letter, idx) => (
                  <motion.span 
                    key={idx} 
                    variants={letterVariants}
                    className={
                      letter === 'R' || letter === 'A' 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#D4AF37]' 
                        : ''
                    }
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Gujarati Subtitle with tracking expansion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 1 }}
                className="text-lg md:text-xl font-bold tracking-[0.2em] text-[#C5A059] opacity-90 font-sans"
              >
                રાગઅનુભૂતિ
              </motion.div>
              
              {/* App Category Label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="text-xs tracking-widest text-zinc-400 uppercase font-semibold mt-1"
              >
                Interactive Virtual Concert Grand
              </motion.p>
            </div>

            {/* Premium Progress Bar */}
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-2 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37]"
                style={{ width: `${progress}%` }}
                layoutId="splash-progress"
              />
              {/* Subtle trailing glow */}
              <div 
                className="absolute top-0 bottom-0 bg-white/60 blur-[2px] transition-all duration-75"
                style={{ left: `calc(${progress}% - 8px)`, width: '8px' }}
              />
            </div>
          </div>

          {/* Bottom Signature Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="w-full text-center relative z-10 space-y-2"
          >
            <div className="flex items-center justify-center space-x-2 text-xs text-zinc-500 font-bold uppercase tracking-widest">
              <span>Made with</span>
              <span className="text-[#C5A059] animate-pulse">❤️</span>
              <span>by</span>
              <span className="text-zinc-300 font-extrabold hover:text-[#C5A059] transition-colors duration-300 cursor-default">
                Parth Pawar
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 font-medium">
              © {new Date().getFullYear()} RaagAnubhuti. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
