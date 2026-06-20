import React, { useState, useEffect, useRef } from 'react';
import { usePianoStore } from '../store/settings';
import { useAudio } from '../hooks/useAudio';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Piano } from '../components/Piano';
import { Controls } from '../components/Controls';
import { Metronome } from '../components/Metronome';
import { Recorder } from '../components/Recorder';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { StatsModal } from '../components/StatsModal';
import { DEMO_SONGS } from '../utils/demoSongs';
import type { DemoSong } from '../utils/demoSongs';
import { FiMusic, FiPlayCircle, FiZap, FiSliders, FiVolume2, FiCpu } from 'react-icons/fi';
import { SongLibrary } from '../components/SongLibrary';
import { SongCreator } from '../components/SongCreator';
import { KeyboardRemapper } from '../components/KeyboardRemapper';
import { PracticeScoreboard } from '../components/PracticeScoreboard';
import { useKeyboard } from '../hooks/useKeyboard';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const midiNoteToName = (noteNum: number): string => {
  const pitch = NOTE_NAMES[noteNum % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  return `${pitch}${octave}`;
};

export const Home: React.FC = () => {
  const { playNote, stopNote, isLoading } = useAudio();
  
  // Register physical keyboard listeners to map computer keys to notes
  useKeyboard(playNote, stopNote);
  
  const activeKeys = usePianoStore((s) => s.activeKeys);
  const addActiveKey = usePianoStore((s) => s.addActiveKey);
  const removeActiveKey = usePianoStore((s) => s.removeActiveKey);
  const clearActiveKeys = usePianoStore((s) => s.clearActiveKeys);
  const setMidiDevices = usePianoStore((s) => s.setMidiDevices);
  const isRecording = usePianoStore((s) => s.isRecording);
  const recordNote = usePianoStore((s) => s.recordNote);
  const incrementNotesPlayed = usePianoStore((s) => s.incrementNotesPlayed);
  const addPlayTime = usePianoStore((s) => s.addPlayTime);

  // Playback & Practice Store selectors
  const activeSong = usePianoStore((s) => s.activeSong);
  const isPlayingSong = usePianoStore((s) => s.isPlayingSong);
  const setIsPlayingSong = usePianoStore((s) => s.setIsPlayingSong);
  const songTime = usePianoStore((s) => s.songTime);
  const setSongTime = usePianoStore((s) => s.setSongTime);
  const songSpeed = usePianoStore((s) => s.songSpeed);
  const waitMode = usePianoStore((s) => s.waitMode);
  const songVolume = usePianoStore((s) => s.songVolume);
  const showScoreboard = usePianoStore((s) => s.showScoreboard);
  const setShowScoreboard = usePianoStore((s) => s.setShowScoreboard);
  const resetScore = usePianoStore((s) => s.resetScore);

  // Local states for Demo mode
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [currentDemoName, setCurrentDemoName] = useState<string | null>(null);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const demoTimeouts = useRef<number[]>([]);
  const triggeredBackingNotes = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef<number>(0);
  const workbenchRef = useRef<HTMLDivElement>(null);
  
  // Track play session duration
  useEffect(() => {
    // Increment session count on load
    const stats = usePianoStore.getState().stats;
    const nextStats = { 
      ...stats, 
      sessionsCount: stats.sessionsCount + 1,
      lastPlayedDate: new Date().toLocaleDateString()
    };
    usePianoStore.setState({ stats: nextStats });
    localStorage.setItem('piano_stats', JSON.stringify(nextStats));

    // Record time spent practicing every 10 seconds
    const interval = setInterval(() => {
      addPlayTime(10);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Web MIDI API listener setup
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          const updateDevices = () => {
            const inputs = Array.from(access.inputs.values());
            setMidiDevices(inputs.map((i) => i.name || 'MIDI Keyboard'));
          };

          // Initial listing
          updateDevices();

          // Listen for plug/unplug events
          access.onstatechange = () => {
            updateDevices();
          };

          // Attach message listeners to each input port
          Array.from(access.inputs.values()).forEach((input) => {
            input.onmidimessage = (msg) => {
              if (!msg.data) return;
              const status = msg.data[0];
              const noteNumber = msg.data[1];
              const velocity = msg.data[2];
              const command = status & 0xf0;

              // Note On event
              if (command === 0x90 && velocity > 0) {
                const noteName = midiNoteToName(noteNumber);
                addActiveKey(noteName);
                playNote(noteName, velocity / 127);
                incrementNotesPlayed();

                if (isRecording) {
                  recordNote(noteName, velocity / 127);
                }

                // Practice scoring evaluation (Hit Check)
                const currentActiveSong = usePianoStore.getState().activeSong;
                const currentSongTime = usePianoStore.getState().songTime;
                const currentTriggerNoteHit = usePianoStore.getState().triggerNoteHit;
                if (currentActiveSong && currentActiveSong.notes) {
                  const threshold = 250;
                  const matchNote = currentActiveSong.notes.find(
                    (n) => n.note === noteName && Math.abs(n.time - currentSongTime) <= threshold && !n.hit && !n.missed
                  );
                  if (matchNote) {
                    matchNote.hit = true;
                    currentTriggerNoteHit(noteName);
                  }
                }
              }
              // Note Off event
              else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
                const noteName = midiNoteToName(noteNumber);
                removeActiveKey(noteName);
                stopNote(noteName);
              }
            };
          });
        })
        .catch((err) => {
          console.warn('Web MIDI API is not supported in this browser:', err);
        });
    }
  }, [isRecording]);

  // Ticker clock scheduler loop for active song timeline playback
  useEffect(() => {
    let animationFrameId: number;
    lastTimeRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const state = usePianoStore.getState();
      const currentActiveSong = state.activeSong;
      const currentIsPlayingSong = state.isPlayingSong;
      const currentSongTime = state.songTime;
      const currentSongSpeed = state.songSpeed;
      const currentWaitMode = state.waitMode;
      const currentActiveKeys = state.activeKeys;

      if (currentIsPlayingSong && currentActiveSong) {
        let nextTime = currentSongTime + dt * currentSongSpeed;
        let shouldFreeze = false;

        // Check if waitMode is enabled
        if (currentWaitMode) {
          // Find notes that are scheduled at or before the nextTime
          // but have not been hit yet.
          const unhitNotes = currentActiveSong.notes.filter(
            (n) => n.time <= nextTime && !n.hit && !n.missed
          );

          if (unhitNotes.length > 0) {
            // Find the earliest unhit note timestamp
            const earliestTime = Math.min(...unhitNotes.map((n) => n.time));
            
            // If the timeline has reached or passed that timestamp, freeze it there
            if (currentSongTime >= earliestTime) {
              nextTime = earliestTime;
              shouldFreeze = true;

              // Check if the user is pressing the correct keys
              const requiredNotes = unhitNotes.filter((n) => n.time === earliestTime);
              const allKeysPressed = requiredNotes.every((rn) =>
                currentActiveKeys.includes(rn.note)
              );

              if (allKeysPressed) {
                // Mark all required notes as hit and unfreeze
                requiredNotes.forEach((rn) => {
                  rn.hit = true;
                  state.triggerNoteHit(rn.note);
                });
                shouldFreeze = false;
                // Let timeline advance by a small increment so it doesn't get stuck on the same ms
                nextTime = earliestTime + 1;
              }
            } else {
              // Timeline is heading towards the earliest note, but hasn't reached it yet
              if (nextTime > earliestTime) {
                nextTime = earliestTime;
              }
            }
          }
        } else {
          // Normal mode: check for missed notes
          currentActiveSong.notes.forEach((n) => {
            if (currentSongTime > n.time + 250 && !n.hit && !n.missed) {
              n.missed = true;
              state.triggerNoteMiss(n.note);
            }
          });
        }

        // Check if song has finished
        if (!shouldFreeze) {
          if (nextTime >= currentActiveSong.duration) {
            setIsPlayingSong(false);
            setSongTime(0);
            setShowScoreboard(true);
            triggeredBackingNotes.current.clear();
          } else {
            setSongTime(nextTime);

            // Sequencer Auto-Play logic
            currentActiveSong.notes.forEach((note) => {
              const noteKey = `${note.note}-${note.time}`;
              if (nextTime >= note.time && !triggeredBackingNotes.current.has(noteKey)) {
                triggeredBackingNotes.current.add(noteKey);
                // Play backing note
                playNote(note.note, songVolume);
                setTimeout(() => {
                  stopNote(note.note);
                }, note.duration);
              }
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    if (isPlayingSong) {
      lastTimeRef.current = performance.now();
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlayingSong, activeSong, songVolume, songSpeed, waitMode, playNote, stopNote]);

  const startPracticeSong = () => {
    if (activeSong && activeSong.notes) {
      activeSong.notes.forEach((n) => {
        n.hit = false;
        n.missed = false;
      });
    }
    triggeredBackingNotes.current.clear();
    resetScore();
    setSongTime(0);
    setIsPlayingSong(true);
  };

  // Find current chord symbol from the song chord track
  const getCurrentSongChord = () => {
    if (!activeSong || !activeSong.chords) return '';
    // Find the chord with time <= songTime, sorted descending by time
    const passedChords = activeSong.chords.filter((c) => c.time <= songTime);
    if (passedChords.length === 0) return '';
    return passedChords[passedChords.length - 1].chord;
  };

  // Find current lyric from the song lyric track
  const getCurrentSongLyric = () => {
    if (!activeSong || !activeSong.lyrics) return { current: '', next: '' };
    const passedLyrics = activeSong.lyrics.filter((l) => l.time <= songTime);
    const current = passedLyrics.length > 0 ? passedLyrics[passedLyrics.length - 1].text : '';
    
    const remainingLyrics = activeSong.lyrics.filter((l) => l.time > songTime);
    const next = remainingLyrics.length > 0 ? remainingLyrics[0].text : '';
    
    return { current, next };
  };

  // Demo playback handler
  const playDemoSong = (song: DemoSong) => {
    stopDemoSong();
    setIsPlayingDemo(true);
    setCurrentDemoName(song.name);

    const timeouts: number[] = [];

    song.notes.forEach((noteData) => {
      // Schedule key down (play note + glow styling)
      const playId = window.setTimeout(() => {
        playNote(noteData.note, 0.85);
        addActiveKey(noteData.note);
      }, noteData.time);

      timeouts.push(playId);

      // Schedule key up (stop note + remove glow)
      const stopId = window.setTimeout(() => {
        stopNote(noteData.note);
        removeActiveKey(noteData.note);
      }, noteData.time + noteData.duration);

      timeouts.push(stopId);
    });

    // Reset playing state on completion
    const endId = window.setTimeout(() => {
      setIsPlayingDemo(false);
      setCurrentDemoName(null);
      clearActiveKeys();
    }, song.duration);

    timeouts.push(endId);
    demoTimeouts.current = timeouts;
  };

  const stopDemoSong = () => {
    demoTimeouts.current.forEach((id) => window.clearTimeout(id));
    demoTimeouts.current = [];
    setIsPlayingDemo(false);
    setCurrentDemoName(null);
    clearActiveKeys();
  };

  const scrollToWorkbench = () => {
    workbenchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bgLight text-textPrimaryLight dark:bg-[#09090b] dark:text-zinc-100 transition-colors duration-300 flex flex-col relative">
      
      {/* Premium Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b]/90 backdrop-blur-md transition-opacity duration-300">
          <div className="p-8 rounded-3xl border border-white/5 bg-[#141416]/85 shadow-2xl backdrop-blur-xl max-w-sm text-center space-y-6">
            <div className="relative flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#D4AF37] text-black shadow-lg animate-bounce">
              <FiMusic className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">RaagAnubhuti (રાગઅનુભૂતિ)</h3>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">Initializing high-fidelity concert grand piano samples...</p>
            </div>
            <div className="flex items-end justify-center space-x-1.5 h-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-1 rounded-full bg-[#C5A059] visualizer-bar animate-in fade-in"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                    animationDuration: '0.8s',
                    height: '24px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Header onOpenHelp={() => setIsHelpOpen(true)} onOpenStats={() => setIsStatsOpen(true)} />
      
      {/* 1. Landing Hero Section */}
      <section className="relative w-full py-20 px-6 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-[#EEF2F6] to-white dark:from-[#09090b] dark:to-[#0c0c0e]">
        {/* Floating background music notes */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
          <div className="absolute top-10 left-[10%] text-4xl animate-bounce duration-[6s]"><FiMusic className="text-[#C5A059]" /></div>
          <div className="absolute top-[40%] right-[15%] text-5xl animate-pulse duration-[8s]"><FiMusic className="text-[#C5A059]" /></div>
          <div className="absolute bottom-20 left-[20%] text-3xl animate-bounce duration-[4s]"><FiMusic className="text-[#C5A059]" /></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#C5A059]/10 text-[#C5A059]">
            <FiZap className="h-3.5 w-3.5 animate-pulse" />
            <span>Interactive Web Audio Engine</span>
          </span>
          
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-textPrimaryLight dark:text-white">
            Play Realistic Piano <br />
            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] bg-clip-text text-transparent">
              Directly in Your Browser.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-textSecondaryLight dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Experience ultra-low latency, studio-sampled acoustic grand pianos, spacebar sustain pedal support, live chord detection, scale guides, and full MIDI hardware support.
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={scrollToWorkbench}
              className="px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:opacity-90 rounded-2xl text-black font-extrabold shadow-xl shadow-amber-950/20 hover:scale-[1.02] transition-all transform duration-200"
            >
              Start Playing Now
            </button>
          </div>
        </div>
      </section>

      {/* 2. Feature Cards Section */}
      <section className="py-12 bg-white dark:bg-bgDark/30 border-y border-glassBorderLight dark:border-glassBorderDark px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl border border-glassBorderLight bg-surfaceLight/50 dark:border-glassBorderDark dark:bg-surfaceDark/50">
            <FiCpu className="text-primaryColor h-6 w-6 mb-3" />
            <h4 className="font-bold mb-1">Low Latency</h4>
            <p className="text-xs text-textSecondaryLight dark:text-textSecondaryDark">Instant note response optimized with the Tone.js scheduling scheduler.</p>
          </div>
          <div className="p-5 rounded-2xl border border-glassBorderLight bg-surfaceLight/50 dark:border-glassBorderDark dark:bg-surfaceDark/50">
            <FiVolume2 className="text-cyanColor h-6 w-6 mb-3" />
            <h4 className="font-bold mb-1">Authentic Samples</h4>
            <p className="text-xs text-textSecondaryLight dark:text-textSecondaryDark">Real grand piano minor-third recordings blended dynamically with EQ presets.</p>
          </div>
          <div className="p-5 rounded-2xl border border-glassBorderLight bg-surfaceLight/50 dark:border-glassBorderDark dark:bg-surfaceDark/50">
            <FiZap className="text-accentColor h-6 w-6 mb-3" />
            <h4 className="font-bold mb-1">MIDI Plug-and-Play</h4>
            <p className="text-xs text-textSecondaryLight dark:text-textSecondaryDark">Connect any standard MIDI controller keyboard to unlock organic velocity triggers.</p>
          </div>
          <div className="p-5 rounded-2xl border border-glassBorderLight bg-surfaceLight/50 dark:border-glassBorderDark dark:bg-surfaceDark/50">
            <FiSliders className="text-purple-500 h-6 w-6 mb-3" />
            <h4 className="font-bold mb-1">Practice Assistant</h4>
            <p className="text-xs text-textSecondaryLight dark:text-textSecondaryDark">Real-time chord name display overlays and highlighted scale guide keys.</p>
          </div>
        </div>
      </section>

      {/* 3. Interactive Piano Workbench Section */}
      <section ref={workbenchRef} className="flex-1 py-12 px-2 sm:px-6 bg-gradient-to-b from-white to-[#EEF2F6] dark:from-[#0F172A] dark:to-bgDark">
        
        {/* Scrolling Lyrics & Chords Track for active songs */}
        {activeSong && (
          <div className="w-full max-w-7xl mx-auto px-4 mb-4 flex flex-col md:flex-row gap-4 items-stretch select-none animate-in fade-in duration-300">
            {/* Chord Box */}
            <div className="flex flex-col justify-center items-center p-4 bg-surfaceLight/60 dark:bg-surfaceDark/60 border border-glassBorderLight dark:border-glassBorderDark rounded-2xl md:w-48 text-center shrink-0 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                Song Chord
              </span>
              <span className="text-3xl font-black text-primaryColor dark:text-cyanColor min-h-10 mt-1">
                {getCurrentSongChord() || '—'}
              </span>
            </div>

            {/* Scrolling Lyric Track */}
            <div className="flex-1 flex flex-col justify-center px-6 py-4 bg-surfaceLight/60 dark:bg-surfaceDark/60 border border-glassBorderLight dark:border-glassBorderDark rounded-2xl shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50 mb-2">
                Karaoke Lyrics
              </span>
              <div className="flex flex-col min-h-12 justify-center">
                {getCurrentSongLyric().current ? (
                  <>
                    <p className="text-lg font-extrabold text-primaryColor dark:text-cyanColor transition-all duration-300">
                      {getCurrentSongLyric().current}
                    </p>
                    {getCurrentSongLyric().next && (
                      <p className="text-xs font-semibold text-textSecondaryLight/60 dark:text-textSecondaryDark/40 mt-1 transition-all duration-300">
                        Up next: {getCurrentSongLyric().next}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-semibold text-textSecondaryLight/45 dark:text-textSecondaryDark/30 italic">
                    Waiting for song introduction...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Core Piano Component */}
        <Piano />

        {/* Master Controls Section */}
        <Controls isLoadingAudio={isLoading} />

        {/* Modular Metronome & Recording & Demo Songs */}
        <div className="w-full max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metronome */}
            <Metronome />

            {/* Recorder */}
            <Recorder />

            {/* Auto-Play Demo Songs Widget */}
            <div className="flex flex-col p-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 rounded-2xl border border-glassBorderLight dark:border-glassBorderDark shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
                    Demo Songbook
                  </span>
                  <span className="text-sm font-bold text-textPrimaryLight dark:text-textPrimaryDark">
                    {isPlayingDemo ? (
                      <span className="flex items-center text-cyanColor animate-pulse">
                        <FiPlayCircle className="mr-1.5 h-4.5 w-4.5" /> Playing: {currentDemoName}
                      </span>
                    ) : (
                      'Watch & Learn Scales'
                    )}
                  </span>
                </div>

                {isPlayingDemo && (
                  <button
                    onClick={stopDemoSong}
                    className="flex h-8 px-3 items-center justify-center rounded-lg bg-red-500 text-white text-xs font-bold shadow-md hover:bg-red-600 transition-colors"
                  >
                    Stop Demo
                  </button>
                )}
              </div>

              {/* Demo Catalog List */}
              <div className="flex-1 overflow-y-auto max-h-[160px] pr-1 space-y-2.5">
                {Object.entries(DEMO_SONGS).map(([key, song]) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-200
                      ${currentDemoName === song.name
                        ? 'border-cyanColor/30 bg-cyanColor/5'
                        : 'border-glassBorderLight bg-surfaceLight dark:border-glassBorderDark dark:bg-surfaceDark/60'
                      }
                    `}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold truncate text-textPrimaryLight dark:text-textPrimaryDark">
                        {song.name}
                      </span>
                      <span className="text-[10px] text-textSecondaryLight/80 dark:text-textSecondaryDark/60 mt-0.5">
                        {song.composer}
                      </span>
                    </div>

                    <button
                      onClick={() => playDemoSong(song)}
                      className="flex h-7 px-3 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold bg-gradient-to-r from-primaryColor to-cyanColor text-white hover:opacity-90 shadow-md"
                    >
                      Auto Play
                    </button>
                  </div>
                ))}
              </div>
              
              {/* CSS Animated Equalizer Wave Visualizer */}
              <div className="mt-4 flex items-end justify-center space-x-1.5 h-8 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-glassBorderLight dark:border-glassBorderDark py-1.5 overflow-hidden">
                {Array.from({ length: 18 }).map((_, idx) => {
                  const active = activeKeys.length > 0 || isPlayingDemo;
                  return (
                    <div
                      key={idx}
                      className={`w-1 rounded-full bg-gradient-to-t from-primaryColor to-cyanColor transition-all duration-300
                        ${active ? 'visualizer-bar' : 'h-1.5'}
                      `}
                      style={{
                        animationDelay: `${idx * 0.08}s`,
                        animationDuration: `${0.8 + Math.random() * 0.8}s`,
                        height: active ? undefined : '6px',
                      }}
                    />
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* AI Karaoke Trainer Suite Dashboard */}
        <div className="w-full max-w-7xl mx-auto px-4 mt-10">
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="h-6 w-1 bg-gradient-to-t from-primaryColor to-cyanColor rounded-full" />
            <h3 className="text-xl font-black text-textPrimaryLight dark:text-textPrimaryDark tracking-tight flex items-center">
              <FiCpu className="mr-2 text-cyanColor h-5.5 w-5.5" /> AI Karaoke Trainer Suite
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Song Library */}
            <div className="lg:col-span-5">
              <SongLibrary onSongSelected={startPracticeSong} />
            </div>

            {/* Right Column: Song Creator & Keyboard Remapper */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <SongCreator />
              <KeyboardRemapper />
            </div>
          </div>
        </div>

      </section>

      {/* Modals Container */}
      <KeyboardShortcuts isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      
      {showScoreboard && (
        <PracticeScoreboard
          onRestart={startPracticeSong}
          onClose={() => setShowScoreboard(false)}
        />
      )}

      <Footer />
    </div>
  );
};
export default Home;
