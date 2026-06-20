import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  isActive: boolean;
  isHighlighted: boolean; // For scale practice mode
  label: string; // Keyboard mapping character (e.g. 'A', 'W')
  showLabels: boolean;
  onPress: (note: string, velocity?: number) => void;
  onRelease: (note: string) => void;
  leftOffset?: string; // For absolute positioning of black keys
  widthOffset?: string; // For absolute width of black keys
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isBlack,
  isActive,
  isHighlighted,
  label,
  showLabels,
  onPress,
  onRelease,
  leftOffset,
  widthOffset,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Cleanup old ripples
  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle primary clicks
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    e.preventDefault();
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Calculate relative coordinates for click ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);
    onPress(note);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    // If the pointer enters the key while the button is pressed, play the note (glissando/slide play)
    if (e.buttons === 1) {
      onPress(note);
    }
  };

  const handlePointerLeave = () => {
    onRelease(note);
  };

  const handlePointerUp = () => {
    onRelease(note);
  };

  // Get note label representation (e.g., C4)
  const getNoteName = (n: string) => {
    // Remove the octave for key printing
    return n.replace(/\d/, '');
  };

  // Check if note is C to show guide label
  const isC = note.startsWith('C') && !note.includes('#');

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      style={
        isBlack
          ? { left: leftOffset, width: widthOffset, position: 'absolute' }
          : { position: 'relative' }
      }
      className={`
        select-none cursor-pointer flex flex-col justify-end items-center transition-all duration-75
        ${
          isBlack
            ? `piano-key-black h-[180px] rounded-b-md shadow-md bg-gradient-to-b from-[#111827] to-[#1F2937] hover:to-[#374151] border-t border-x border-gray-800
               ${isActive ? 'bg-[#5C3E14] border-[#D4AF37] shadow-[0_0_12px_rgba(197,160,89,0.8)] translate-y-0.5' : ''}
               ${isHighlighted && !isActive ? 'border-[#C5A059]/40 bg-gradient-to-b from-[#2E200B] to-[#453112]' : ''}
              `
            : `piano-key-white flex-1 h-[280px] rounded-b-xl border-b-[6px] bg-gradient-to-b transition-colors duration-100
               border-[#D1D5DB] from-white to-[#F9FAFB] hover:to-[#E5E7EB] border-r border-l-[0.5px] border-l-gray-200 border-r-gray-300
               dark:border-[#1F2937] dark:from-[#111827] dark:to-[#1F2937] dark:hover:to-[#1F2937]/80 dark:border-r-[#111827]
               ${isActive ? 'border-[#D4AF37] from-[#FDF6E2] to-[#F5E1A4] dark:from-[#5C3E14] dark:to-[#8F6B2A] dark:border-[#D4AF37] shadow-[0_4px_12px_rgba(197,160,89,0.5)] translate-y-0.5 border-b-[2px] mt-[4px] h-[276px]' : ''}
               ${isHighlighted && !isActive ? 'border-[#C5A059] from-[#FFFDF9] to-[#FFF9E6] dark:from-[#3D2C11] dark:to-[#543E1A]' : ''}
              `
        }
      `}
    >
      {/* Ripple Animation Container */}
      <div className="absolute inset-0 overflow-hidden rounded-b-lg pointer-events-none">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ transform: 'scale(0) translate(-50%, -50%)', opacity: 0.6 }}
              animate={{ transform: 'scale(4) translate(-50%, -50%)', opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onAnimationComplete={() => removeRipple(ripple.id)}
              style={{
                left: ripple.x,
                top: ripple.y,
                position: 'absolute',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.35)',
                transformOrigin: 'top left',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Glow Highlight Effect */}
      {isActive && (
        <div className="absolute top-0 inset-x-0 h-1 blur-[3px] rounded-full pointer-events-none bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
      )}

      {/* Key Mapping Labels & Note Names */}
      <div className="mb-4 flex flex-col items-center justify-end pointer-events-none select-none text-[10px] sm:text-xs">
        
        {/* Computer Keyboard Map Label */}
        {showLabels && label && (
          <span className={`
            font-bold px-1.5 py-0.5 rounded border mb-1.5 leading-none transition-colors duration-200
            ${isBlack 
              ? `bg-gray-800 border-gray-700 text-[#C5A059] ${isActive ? 'bg-[#C5A059] border-white text-black' : ''}`
              : `bg-gray-100 border-gray-300 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 ${isActive ? 'bg-white border-[#C5A059] text-black font-extrabold' : ''}`
            }
          `}>
            {label.toUpperCase()}
          </span>
        )}

        {/* Note Name Label (Always show C keys to guide beginner, show others optionally) */}
        <span className={`
          font-sans tracking-tight leading-none transition-colors duration-200
          ${isBlack 
            ? `text-textSecondaryDark/50 font-medium ${isActive ? 'text-white' : ''}` 
            : `${isC ? 'text-[#C5A059] font-bold dark:text-[#C5A059]' : 'text-textSecondaryLight/50 dark:text-textSecondaryDark/35 font-medium'} ${isActive ? 'text-black font-extrabold dark:text-white' : ''}`
          }
        `}>
          {isC || showLabels ? note : getNoteName(note)}
        </span>
      </div>
    </div>
  );
};
export default PianoKey;
