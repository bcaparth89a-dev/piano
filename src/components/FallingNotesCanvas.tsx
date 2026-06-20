import React, { useRef, useEffect, useState } from 'react';
import { usePianoStore } from '../store/settings';
import { generate88Keys } from './Piano';
import type { PianoKeyData } from './Piano';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export const FallingNotesCanvas: React.FC = () => {
  const activeSong = usePianoStore((s) => s.activeSong);
  const isPlayingSong = usePianoStore((s) => s.isPlayingSong);
  const songTime = usePianoStore((s) => s.songTime);
  const fallingSpeed = usePianoStore((s) => s.fallingSpeed);
  const waitMode = usePianoStore((s) => s.waitMode);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);

  const [keys] = useState<PianoKeyData[]>(generate88Keys);
  const whiteKeysCount = 52;

  // Create sparks when keys are struck or notes hit the bar
  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 6; i++) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        size: Math.random() * 3 + 1,
        color,
        alpha: 1.0,
        life: 30 + Math.random() * 20, // frames of life
      });
    }
  };

  // Redraw loop
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const hitLineY = H - 10; // Hit line is 10px from the bottom boundary

    // Speed calculation: pixels per millisecond (based on configurable speed multiplier)
    const pxPerMs = 0.12 * fallingSpeed;

    // 1. Clear Canvas
    ctx.clearRect(0, 0, W, H);

    // 2. Draw Column Lanes guides (subtle divider lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const wKeyWidth = W / whiteKeysCount;
    for (let i = 1; i < whiteKeysCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * wKeyWidth, 0);
      ctx.lineTo(i * wKeyWidth, H);
      ctx.stroke();
    }

    // 3. Draw Falling Notes if a song is loaded
    if (activeSong && activeSong.notes) {
      activeSong.notes.forEach((note) => {
        // Render notes visible in current canvas view
        const timeRemaining = note.time - songTime;
        const noteDuration = note.duration;

        // Calculate Y Positions
        // Bottom of the falling block represents note start time
        const yBottom = hitLineY - (timeRemaining * pxPerMs);
        // Top of the block represents note end time
        const yTop = yBottom - (noteDuration * pxPerMs);

        // If the note is completely past the hit-line or not yet reached the canvas top, skip drawing
        if (yBottom < 0 || yTop > H) return;

        // Determine X coordinate and width of the note based on piano columns
        const keyInfo = keys.find((k) => k.note === note.note);
        if (!keyInfo) return;

        let x = 0;
        let width = 0;

        if (keyInfo.isBlack) {
          width = wKeyWidth * 0.65;
          x = (keyInfo.leftWhiteIndex + 1) * wKeyWidth - width / 2;
        } else {
          width = wKeyWidth;
          x = keyInfo.leftWhiteIndex * wKeyWidth;
        }

        // Draw note block
        ctx.save();
        
        // Dynamic colors: white keys get gold, black keys get metallic gold gradients
        const grad = ctx.createLinearGradient(x, yTop, x + width, yBottom);
        if (keyInfo.isBlack) {
          grad.addColorStop(0, '#D4AF37'); // Metallic Gold
          grad.addColorStop(1, '#B29023');
        } else {
          grad.addColorStop(0, '#C5A059'); // Gold
          grad.addColorStop(1, '#A67C37');
        }

        // Determine if note is currently crossing the hit line
        const isCrossingHitLine = songTime >= note.time && songTime <= note.time + note.duration;

        ctx.fillStyle = grad;
        
        // Draw rounded note rect
        ctx.beginPath();
        const radius = Math.min(width / 2, 4);
        ctx.roundRect(x + 1, yTop, width - 2, Math.max(yBottom - yTop, 2), radius);
        ctx.fill();

        // Add glowing borders / shadows for active crossing notes
        if (isCrossingHitLine) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Spawn spark particles at key hit line periodically
          if (Math.random() < 0.3) {
            spawnParticles(
              x + width / 2,
              hitLineY,
              keyInfo.isBlack ? '#D4AF37' : '#C5A059'
            );
          }
        }

        ctx.restore();
      });
    }

    // 4. Draw Hit Line boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, hitLineY);
    ctx.lineTo(W, hitLineY);
    ctx.stroke();

    // 5. Draw and update particles
    particles.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life--;
      p.alpha = Math.max(0, p.life / 50);

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Cleanup dead particles
    particles.current = particles.current.filter((p) => p.life > 0);

    // Continue loop if playing or notes exist
    if (isPlayingSong || particles.current.length > 0) {
      animationRef.current = requestAnimationFrame(draw);
    }
  };

  // Sync canvas dimensions with parent DOM element
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const parent = canvas.parentElement;
      if (parent) {
        // Set canvas buffer sizes to match container layout width
        canvas.width = parent.clientWidth;
        canvas.height = 240; // Fixed visualizer height
        draw();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSong, fallingSpeed]);

  // Trigger draw updates when playback state or timeline ticks
  useEffect(() => {
    if (isPlayingSong) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }
  }, [isPlayingSong, songTime]);

  return (
    <div className="relative w-full h-[240px] bg-gradient-to-b from-gray-950 to-gray-900 border-b border-gray-800 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
      {/* Visual Indicator of Wait Mode Freeze */}
      {waitMode && isPlayingSong && activeSong && (
        <div className="absolute top-3 left-4 bg-yellow-500/25 border border-yellow-500/40 text-yellow-300 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse backdrop-blur-sm">
          WAIT MODE: Press highlighted keys to advance timeline
        </div>
      )}
    </div>
  );
};
export default FallingNotesCanvas;
