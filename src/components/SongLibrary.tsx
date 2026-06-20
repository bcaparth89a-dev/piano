import React, { useState } from 'react';
import { usePianoStore } from '../store/settings';
import type { Song } from '../store/settings';
import { DEFAULT_SONGS } from '../utils/defaultSongs';
import { FiSearch, FiStar, FiChevronRight, FiGrid, FiTrash2, FiClock, FiMusic } from 'react-icons/fi';

interface SongLibraryProps {
  onSongSelected: () => void;
}

export const SongLibrary: React.FC<SongLibraryProps> = ({ onSongSelected }) => {
  const customSongs = usePianoStore((s) => s.customSongs);
  const deleteCustomSong = usePianoStore((s) => s.deleteCustomSong);
  const favoriteSongIds = usePianoStore((s) => s.favoriteSongIds);
  const toggleFavoriteSong = usePianoStore((s) => s.toggleFavoriteSong);
  const setActiveSong = usePianoStore((s) => s.setActiveSong);
  const activeSong = usePianoStore((s) => s.activeSong);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'custom'>('all');

  // Combine default library with custom songs
  const allDefaultSongs = Object.values(DEFAULT_SONGS);
  const combinedSongs = [...allDefaultSongs, ...customSongs];

  // Filtering logic
  const filteredSongs = combinedSongs.filter((song) => {
    // 1. Search Query filter (matches Title or Artist)
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Difficulty filter
    const matchesDifficulty =
      filterDifficulty === 'all' || song.difficulty === filterDifficulty;

    // 3. Tab category filter
    const isFavorite = favoriteSongIds.includes(song.id);
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'favorites' && isFavorite) ||
      (activeTab === 'custom' && song.isCustom);

    return matchesSearch && matchesDifficulty && matchesTab;
  });

  const handleSelectSong = (song: Song) => {
    setActiveSong(song);
    onSongSelected();
  };

  // Duration parser helper
  const formatSongDuration = (ms: number) => {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col p-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 rounded-2xl border border-glassBorderLight dark:border-glassBorderDark shadow-lg backdrop-blur-md h-full">
      <div className="flex items-center space-x-2 mb-4">
        <FiMusic className="text-primaryColor dark:text-cyanColor h-5 w-5" />
        <h3 className="text-base font-bold text-textPrimaryLight dark:text-textPrimaryDark">
          Song Library Explorer
        </h3>
      </div>

      {/* Search and Difficulty Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-glassBorderLight bg-surfaceLight/60 text-xs font-semibold text-textPrimaryLight focus:border-primaryColor focus:outline-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark dark:focus:border-cyanColor"
          />
          <FiSearch className="absolute left-3 top-3 h-4 w-4 text-textSecondaryLight/60 dark:text-textSecondaryDark/50" />
        </div>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="h-10 px-3 rounded-lg border border-glassBorderLight bg-surfaceLight/60 text-xs font-semibold text-textPrimaryLight focus:border-primaryColor focus:outline-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark dark:focus:border-cyanColor"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-glassBorderLight dark:border-glassBorderDark mb-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 pb-2 border-b-2 text-center transition-colors duration-200
            ${activeTab === 'all'
              ? 'border-primaryColor text-primaryColor dark:border-cyanColor dark:text-cyanColor'
              : 'border-transparent text-textSecondaryLight dark:text-textSecondaryDark/60 hover:text-textPrimaryLight dark:hover:text-textPrimaryDark'
            }
          `}
        >
          All Songs
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 pb-2 border-b-2 text-center transition-colors duration-200
            ${activeTab === 'favorites'
              ? 'border-primaryColor text-primaryColor dark:border-cyanColor dark:text-cyanColor'
              : 'border-transparent text-textSecondaryLight dark:text-textSecondaryDark/60 hover:text-textPrimaryLight dark:hover:text-textPrimaryDark'
            }
          `}
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 pb-2 border-b-2 text-center transition-colors duration-200
            ${activeTab === 'custom'
              ? 'border-primaryColor text-primaryColor dark:border-cyanColor dark:text-cyanColor'
              : 'border-transparent text-textSecondaryLight dark:text-textSecondaryDark/60 hover:text-textPrimaryLight dark:hover:text-textPrimaryDark'
            }
          `}
        >
          Custom
        </button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-2.5">
        {filteredSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-textSecondaryLight/50 dark:text-textSecondaryDark/40">
            <FiGrid className="h-8 w-8 mb-2 opacity-30 animate-pulse" />
            <p>No matching songs found.</p>
            <p className="mt-1">Try refining your search query or check the Custom tab.</p>
          </div>
        ) : (
          filteredSongs.map((song) => {
            const isFav = favoriteSongIds.includes(song.id);
            const isActive = activeSong?.id === song.id;

            return (
              <div
                key={song.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors duration-200 hover:bg-glassHoverLight dark:hover:bg-glassHoverDark
                  ${isActive
                    ? 'border-primaryColor/55 bg-primaryColor/5 dark:border-cyanColor/55 dark:bg-cyanColor/5'
                    : 'border-glassBorderLight bg-surfaceLight dark:border-glassBorderDark dark:bg-surfaceDark/60'
                  }
                `}
              >
                <div
                  onClick={() => handleSelectSong(song)}
                  className="flex-1 flex items-center space-x-3 cursor-pointer min-w-0 pr-3"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate text-textPrimaryLight dark:text-textPrimaryDark">
                      {song.title}
                    </span>
                    <span className="text-[10px] text-textSecondaryLight/80 dark:text-textSecondaryDark/60 mt-0.5">
                      {song.artist}
                    </span>
                    
                    {/* Meta tags inline */}
                    <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${getDifficultyColor(song.difficulty)}`}>
                        {song.difficulty}
                      </span>
                      <span className="flex items-center text-[9px] text-textSecondaryLight/60 dark:text-textSecondaryDark/40">
                        <FiClock className="mr-0.5" /> {formatSongDuration(song.duration)}
                      </span>
                      <span className="text-[9px] text-textSecondaryLight/60 dark:text-textSecondaryDark/40 font-bold">
                        {song.bpm} BPM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {/* Toggle favorite */}
                  <button
                    onClick={() => toggleFavoriteSong(song.id)}
                    title={isFav ? 'Remove from favorites' : 'Mark as favorite'}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-glassBorderLight hover:bg-yellow-50 dark:border-glassBorderDark dark:hover:bg-yellow-500/10 transition-colors
                      ${isFav 
                        ? 'text-yellow-500 border-yellow-500/25 bg-yellow-500/5' 
                        : 'text-textSecondaryLight/70 dark:text-textSecondaryDark/50'
                      }
                    `}
                  >
                    <FiStar className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Play trigger button */}
                  <button
                    onClick={() => handleSelectSong(song)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primaryColor to-cyanColor text-white shadow-md hover:opacity-90 transition-opacity"
                    title="Load Song"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>

                  {/* Delete button for custom songs */}
                  {song.isCustom && (
                    <button
                      onClick={() => deleteCustomSong(song.id)}
                      title="Delete Custom Song"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-glassBorderLight text-red-400 hover:bg-red-50 hover:text-red-500 dark:border-glassBorderDark dark:hover:bg-red-500/10 transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default SongLibrary;
