import React, { useState, useRef, useEffect } from 'react';
import { usePianoStore, type RecordedTrack } from '../store/settings';
import { useAudio } from '../hooks/useAudio';
import { FiMic, FiSquare, FiTrash2, FiClock, FiMusic } from 'react-icons/fi';

export const Recorder: React.FC = () => {
  const { playNote, stopNote } = useAudio();

  const isRecording = usePianoStore((s) => s.isRecording);
  const startRecording = usePianoStore((s) => s.startRecording);
  const stopRecording = usePianoStore((s) => s.stopRecording);
  const recordedTracks = usePianoStore((s) => s.recordedTracks);
  const deleteTrack = usePianoStore((s) => s.deleteTrack);
  const addActiveKey = usePianoStore((s) => s.addActiveKey);
  const removeActiveKey = usePianoStore((s) => s.removeActiveKey);
  const clearActiveKeys = usePianoStore((s) => s.clearActiveKeys);

  const [trackNameInput, setTrackNameInput] = useState('');
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // Keep track of timeouts for playback so we can cancel them if user stops early
  const playbackTimeouts = useRef<number[]>([]);

  // Stop playback if component unmounts
  useEffect(() => {
    return () => {
      stopTrackPlayback();
    };
  }, []);

  const handleStartRecording = () => {
    stopTrackPlayback();
    startRecording();
  };

  const handleStopRecording = () => {
    setShowNamingModal(true);
  };

  const saveRecording = () => {
    stopRecording(trackNameInput.trim() || undefined);
    setTrackNameInput('');
    setShowNamingModal(false);
  };



  const handleDiscard = () => {
    stopRecording('__DISCARD__');
    // Remove the last added track if it was created
    const storeState = usePianoStore.getState();
    const lastTrack = storeState.recordedTracks[0];
    if (lastTrack && lastTrack.name === '__DISCARD__') {
      deleteTrack(lastTrack.id);
    }
    setTrackNameInput('');
    setShowNamingModal(false);
  };

  const stopTrackPlayback = () => {
    playbackTimeouts.current.forEach((id) => window.clearTimeout(id));
    playbackTimeouts.current = [];
    setPlayingTrackId(null);
    clearActiveKeys();
  };

  const playTrack = (track: RecordedTrack) => {
    stopTrackPlayback();
    setPlayingTrackId(track.id);

    const timeouts: number[] = [];

    // Schedule note triggers based on recorded timestamp offsets
    track.notes.forEach((noteEvent) => {
      // Schedule key down (play sound + glow visual)
      const playTimeout = window.setTimeout(() => {
        playNote(noteEvent.note, noteEvent.velocity);
        addActiveKey(noteEvent.note);
      }, noteEvent.time);

      timeouts.push(playTimeout);

      // Schedule key up (stop sound + remove glow visual) after a brief envelope duration (e.g. 350ms)
      const stopTimeout = window.setTimeout(() => {
        stopNote(noteEvent.note);
        removeActiveKey(noteEvent.note);
      }, noteEvent.time + 350);

      timeouts.push(stopTimeout);
    });

    // Schedule end of track state reset
    const endTimeout = window.setTimeout(() => {
      setPlayingTrackId(null);
      clearActiveKeys();
    }, track.duration);

    timeouts.push(endTimeout);
    playbackTimeouts.current = timeouts;
  };

  // Convert milliseconds into readable clock format MM:SS
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col p-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 rounded-2xl border border-glassBorderLight dark:border-glassBorderDark shadow-lg backdrop-blur-md h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
            Recorder
          </span>
          <span className="text-sm font-bold text-textPrimaryLight dark:text-textPrimaryDark">
            {isRecording ? (
              <span className="flex items-center text-red-500 animate-pulse">
                <FiMic className="mr-1.5 h-4.5 w-4.5 animate-bounce" /> RECORDING...
              </span>
            ) : (
              'Save & Play Tracks'
            )}
          </span>
        </div>

        {/* Record Trigger Button */}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-all duration-200
            ${isRecording
              ? 'bg-red-500 border-transparent text-white animate-pulse ring-4 ring-red-500/20'
              : 'border-glassBorderLight bg-surfaceLight text-red-500 hover:bg-red-50 dark:border-glassBorderDark dark:bg-surfaceDark dark:hover:bg-red-500/10'
            }
          `}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? <FiSquare className="h-4.5 w-4.5" /> : <FiMic className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Track List Container */}
      <div className="flex-1 overflow-y-auto max-h-[160px] pr-1 space-y-2.5">
        {recordedTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-textSecondaryLight/50 dark:text-textSecondaryDark/40">
            <FiMusic className="h-8 w-8 mb-2 opacity-30" />
            <p>No tracks recorded yet.</p>
            <p>Press the mic button above to play and record.</p>
          </div>
        ) : (
          recordedTracks.map((track) => (
            <div
              key={track.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-200
                ${playingTrackId === track.id
                  ? 'border-cyanColor/30 bg-cyanColor/5 dark:bg-cyanColor/5'
                  : 'border-glassBorderLight bg-surfaceLight dark:border-glassBorderDark dark:bg-surfaceDark/60'
                }
              `}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-bold truncate text-textPrimaryLight dark:text-textPrimaryDark">
                  {track.name}
                </span>
                <span className="flex items-center text-[10px] text-textSecondaryLight/80 dark:text-textSecondaryDark/60 mt-0.5">
                  <FiClock className="mr-1 h-3 w-3" /> {formatDuration(track.duration)} | {track.instrument.replace('-', ' ')}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {/* Play/Stop button */}
                <button
                  onClick={() => playingTrackId === track.id ? stopTrackPlayback() : playTrack(track)}
                  className={`flex h-7 px-2.5 items-center justify-center rounded-lg text-[10px] font-bold transition-colors
                    ${playingTrackId === track.id
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-primaryColor text-white hover:bg-primaryColor/90'
                    }
                  `}
                >
                  {playingTrackId === track.id ? 'Stop' : 'Play'}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteTrack(track.id)}
                  title="Delete Track"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-glassBorderLight text-textSecondaryLight hover:bg-red-50 hover:text-red-500 dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-red-500/10 transition-colors"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Naming Track Modal Overlay */}
      {showNamingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-glassBorderLight bg-white p-6 shadow-2xl dark:border-glassBorderDark dark:bg-surfaceDark transition-all">
            <h3 className="text-base font-bold text-textPrimaryLight dark:text-textPrimaryDark mb-2">
              Save Recording
            </h3>
            <p className="text-xs text-textSecondaryLight dark:text-textSecondaryDark mb-4">
              Give your new virtual piano recording a name:
            </p>
            
            <input
              type="text"
              maxLength={25}
              placeholder="My Piano Masterpiece"
              value={trackNameInput}
              onChange={(e) => setTrackNameInput(e.target.value)}
              className="w-full h-10 px-3 mb-4 rounded-lg border border-glassBorderLight bg-gray-50 text-sm font-semibold text-textPrimaryLight focus:border-primaryColor focus:outline-none dark:border-glassBorderDark dark:bg-gray-900 dark:text-textPrimaryDark dark:focus:border-cyanColor"
              autoFocus
            />

            <div className="flex space-x-3 justify-end text-xs font-bold">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 border border-glassBorderLight rounded-lg text-textSecondaryLight hover:bg-gray-100 dark:border-glassBorderDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark"
              >
                Discard
              </button>
              <button
                onClick={saveRecording}
                className="px-4 py-2 bg-gradient-to-r from-primaryColor to-cyanColor rounded-lg text-white hover:opacity-90 shadow-md"
              >
                Save Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Recorder;
