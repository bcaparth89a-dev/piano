import React from 'react';
import { usePianoStore } from '../store/settings';
import { FiAward, FiRotateCcw, FiList, FiCheck } from 'react-icons/fi';

interface PracticeScoreboardProps {
  onRestart: () => void;
  onClose: () => void;
}

export const PracticeScoreboard: React.FC<PracticeScoreboardProps> = ({ onRestart, onClose }) => {
  const currentScore = usePianoStore((s) => s.currentScore);
  const correctCount = usePianoStore((s) => s.correctNotesCount);
  const missedCount = usePianoStore((s) => s.missedNotesCount);
  const maxStreak = usePianoStore((s) => s.maxStreak);
  const activeSong = usePianoStore((s) => s.activeSong);
  const resetScore = usePianoStore((s) => s.resetScore);

  const totalNotes = correctCount + missedCount;
  const accuracy = totalNotes > 0 ? Math.round((correctCount / totalNotes) * 100) : 0;

  // Grade evaluator
  const getGrade = (acc: number) => {
    if (acc >= 95) return { grade: 'S', desc: 'Virtuoso! Perfect timing.', color: 'from-amber-400 to-yellow-600 text-yellow-500 shadow-yellow-500/20' };
    if (acc >= 80) return { grade: 'A', desc: 'Excellent! Very accurate.', color: 'from-primaryColor to-cyanColor text-cyanColor shadow-cyanColor/20' };
    if (acc >= 60) return { grade: 'B', desc: 'Good effort! Keep practicing.', color: 'from-green-400 to-emerald-600 text-green-500 shadow-green-500/20' };
    return { grade: 'C', desc: 'Room to grow. Slow down the tempo!', color: 'from-gray-400 to-gray-600 text-gray-500 shadow-gray-500/20' };
  };

  const scoreData = getGrade(accuracy);

  const handleRestart = () => {
    resetScore();
    onRestart();
  };

  const handleClose = () => {
    resetScore();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-glassBorderLight bg-white p-7 shadow-2xl dark:border-glassBorderDark dark:bg-surfaceDark text-center transition-all animate-in zoom-in-95 duration-200">
        
        {/* Award Badge header */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-primaryColor to-cyanColor text-white shadow-xl mb-4 relative">
          <FiAward className="h-10 w-10 animate-bounce" />
          <div className="absolute -inset-1.5 -z-10 rounded-3xl bg-gradient-to-tr from-primaryColor to-cyanColor opacity-25 blur-sm" />
        </div>

        <h2 className="text-2xl font-black text-textPrimaryLight dark:text-textPrimaryDark tracking-tight my-1">
          Practice Complete!
        </h2>
        <p className="text-xs text-textSecondaryLight dark:text-textSecondaryDark/60 mb-6 truncate max-w-xs mx-auto">
          Song: {activeSong?.title || 'Unknown Song'}
        </p>

        {/* Letter Grade Display */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr ${scoreData.color} text-white text-5xl font-black shadow-lg`}>
            {scoreData.grade}
          </div>
          <span className="text-xs font-bold text-textPrimaryLight dark:text-textPrimaryDark mt-3">
            {scoreData.desc}
          </span>
        </div>

        {/* Stats Table Dashboard */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          
          <div className="p-3.5 rounded-xl border border-glassBorderLight bg-gray-50/50 dark:border-glassBorderDark dark:bg-gray-900/40 text-left">
            <span className="text-[9px] font-bold text-textSecondaryLight dark:text-textSecondaryDark/40 uppercase tracking-wider block">
              Final Score
            </span>
            <span className="text-lg font-black text-textPrimaryLight dark:text-textPrimaryDark">
              {currentScore.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-glassBorderLight bg-gray-50/50 dark:border-glassBorderDark dark:bg-gray-900/40 text-left">
            <span className="text-[9px] font-bold text-textSecondaryLight dark:text-textSecondaryDark/40 uppercase tracking-wider block">
              Accuracy
            </span>
            <span className="text-lg font-black text-textPrimaryLight dark:text-textPrimaryDark">
              {accuracy}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-glassBorderLight bg-gray-50/50 dark:border-glassBorderDark dark:bg-gray-900/40 text-left">
            <span className="text-[9px] font-bold text-textSecondaryLight dark:text-textSecondaryDark/40 uppercase tracking-wider block">
              Notes Hit
            </span>
            <span className="text-sm font-bold text-green-500 flex items-center mt-0.5">
              <FiCheck className="mr-1 h-3.5 w-3.5" /> {correctCount} / {totalNotes}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-glassBorderLight bg-gray-50/50 dark:border-glassBorderDark dark:bg-gray-900/40 text-left">
            <span className="text-[9px] font-bold text-textSecondaryLight dark:text-textSecondaryDark/40 uppercase tracking-wider block">
              Max Streak
            </span>
            <span className="text-sm font-bold text-cyanColor flex items-center mt-0.5">
              <FiAward className="mr-1 h-3.5 w-3.5" /> {maxStreak} notes
            </span>
          </div>

        </div>

        {/* Action Triggers */}
        <div className="flex space-x-3 justify-center text-xs font-bold">
          <button
            onClick={handleClose}
            className="flex items-center justify-center h-11 px-5 border border-glassBorderLight bg-surfaceLight hover:bg-glassHoverLight text-textSecondaryLight rounded-xl dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark shadow-sm transition-all"
          >
            <FiList className="mr-1.5 h-4 w-4" />
            <span>Library</span>
          </button>
          
          <button
            onClick={handleRestart}
            className="flex-1 flex items-center justify-center h-11 px-6 bg-gradient-to-r from-primaryColor to-cyanColor hover:opacity-90 rounded-xl text-white shadow-md transition-opacity"
          >
            <FiRotateCcw className="mr-1.5 h-4 w-4 animate-spin-slow" />
            <span>Practice Again</span>
          </button>
        </div>

      </div>
    </div>
  );
};
export default PracticeScoreboard;
