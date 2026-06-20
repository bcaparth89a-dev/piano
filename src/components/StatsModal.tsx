import React from 'react';
import { usePianoStore } from '../store/settings';
import { FiX, FiTrendingUp, FiTrash2, FiClock, FiActivity } from 'react-icons/fi';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const stats = usePianoStore((s) => s.stats);
  const heatmap = usePianoStore((s) => s.heatmap);
  const clearHistory = usePianoStore((s) => s.clearHistory);

  if (!isOpen) return null;

  // Format play time from seconds to readable minutes/hours
  const formatPlayTime = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${totalSeconds % 60}s`;
  };

  // Extract top 5 notes from heatmap
  const favoriteNotes = Object.entries(heatmap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your practice stats and note history?')) {
      clearHistory();
      // Re-initialize default stats
      usePianoStore.setState({
        stats: {
          notesPlayed: 0,
          totalPlayTime: 0,
          sessionsCount: 1, // keep active session
          lastPlayedDate: new Date().toLocaleDateString(),
        }
      });
      // Update localStorage
      localStorage.setItem('piano_stats', JSON.stringify({
        notesPlayed: 0,
        totalPlayTime: 0,
        sessionsCount: 1,
        lastPlayedDate: new Date().toLocaleDateString(),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-glassBorderLight bg-white p-6 shadow-2xl dark:border-glassBorderDark dark:bg-surfaceDark transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glassBorderLight pb-3 dark:border-glassBorderDark">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="text-primaryColor dark:text-cyanColor h-5 w-5 animate-bounce" />
            <h3 className="text-base font-bold text-textPrimaryLight dark:text-textPrimaryDark">
              Practice Statistics Dashboard
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-glassBorderLight text-textSecondaryLight hover:bg-glassHoverLight dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Stat Box: Notes Played */}
            <div className="p-4 rounded-xl border border-glassBorderLight bg-gray-50 dark:border-glassBorderDark dark:bg-gray-900/40">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                <FiActivity className="text-primaryColor" />
                <span>Notes Played</span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold text-textPrimaryLight dark:text-textPrimaryDark">
                {stats.notesPlayed.toLocaleString()}
              </p>
            </div>

            {/* Stat Box: Play Time */}
            <div className="p-4 rounded-xl border border-glassBorderLight bg-gray-50 dark:border-glassBorderDark dark:bg-gray-900/40">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                <FiClock className="text-cyanColor" />
                <span>Play Time</span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold text-textPrimaryLight dark:text-textPrimaryDark">
                {formatPlayTime(stats.totalPlayTime)}
              </p>
            </div>

          </div>

          {/* Favorite Notes List */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
              Top 5 Most Played Notes
            </span>
            <div className="mt-2 space-y-2">
              {favoriteNotes.length === 0 ? (
                <div className="py-4 text-center text-xs text-textSecondaryLight/50 dark:text-textSecondaryDark/40 border border-dashed border-glassBorderLight dark:border-glassBorderDark rounded-lg">
                  Play some notes to build your heatmap!
                </div>
              ) : (
                favoriteNotes.map(([note, count]) => {
                  const maxCount = favoriteNotes[0][1];
                  const barWidth = `${(count / maxCount) * 100}%`;

                  return (
                    <div key={note} className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-xs text-primaryColor dark:text-cyanColor w-10">
                        {note}
                      </span>
                      <div className="flex-1 mx-3 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          style={{ width: barWidth }}
                          className="h-full bg-gradient-to-r from-primaryColor to-cyanColor rounded-full"
                        />
                      </div>
                      <span className="font-bold text-textPrimaryLight dark:text-textPrimaryDark min-w-8 text-right">
                        {count} <span className="text-[9px] font-normal text-textSecondaryLight">hits</span>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <hr className="border-glassBorderLight dark:border-glassBorderDark" />

          {/* Bottom Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              <FiTrash2 className="mr-1 h-3.5 w-3.5" /> Reset Statistics
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-primaryColor to-cyanColor rounded-lg text-white font-bold hover:opacity-90 shadow-md text-xs"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
export default StatsModal;
