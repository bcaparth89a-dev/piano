import React, { useState } from 'react';
import { usePianoStore } from '../store/settings';
import { parseSongFromText } from '../utils/songParser';
import { FiPlus, FiDownload, FiUpload, FiCheckCircle, FiFileText } from 'react-icons/fi';

const EXAMPLE_SONG_TEXT = `[SETTINGS]
title=Amazing Grace Melody
artist=Traditional
bpm=90
difficulty=easy

[LYRICS]
[00:00.0] Amazing grace
[00:03.0] How sweet the sound
[00:06.5] That saved a wretch like me

[CHORDS]
[00:00.0] G
[00:03.0] C
[00:06.5] G

[NOTES]
00:00.0 D4 400
00:00.5 G4 800
00:01.5 B4 300
00:01.8 G4 300
00:02.1 B4 800
00:03.0 A4 400
00:03.5 G4 800
00:04.5 E4 400
00:05.0 D4 800
00:06.5 D4 400
00:07.0 G4 800
00:08.0 B4 300
00:08.3 G4 300
00:08.6 B4 800
00:09.5 A4 400
00:10.0 D5 1400
`;

export const SongCreator: React.FC = () => {
  const addCustomSong = usePianoStore((s) => s.addCustomSong);
  const setActiveSong = usePianoStore((s) => s.setActiveSong);
  const activeSong = usePianoStore((s) => s.activeSong);

  const [editorText, setEditorText] = useState(EXAMPLE_SONG_TEXT);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleParseAndSave = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const parsedSong = parseSongFromText(editorText);
      
      if (parsedSong.notes.length === 0) {
        throw new Error('No valid notes parsed. Check your [NOTES] formatting (e.g. "00:01.5 C4 500").');
      }

      addCustomSong(parsedSong);
      setActiveSong(parsedSong);
      
      setSuccessMessage(`"${parsedSong.title}" parsed and loaded successfully into your Library!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse song text. Verify sections syntax.');
    }
  };

  const handleLoadTemplate = () => {
    setEditorText(EXAMPLE_SONG_TEXT);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Export currently active song as JSON file
  const handleExportJSON = () => {
    if (!activeSong) {
      setErrorMessage('Please load a song from the Library first to export it.');
      return;
    }

    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(activeSong, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      
      // Clean filename: e.g. "amazing-grace-melody.json"
      const safeTitle = activeSong.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      downloadAnchor.setAttribute('download', `${safeTitle}-piano-song.json`);
      
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setSuccessMessage(`"${activeSong.title}" exported as JSON file successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage('Failed to export song to JSON file.');
    }
  };

  // Import custom song from JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const resultText = event.target?.result as string;
        const parsedSong = JSON.parse(resultText);

        // Basic verification of song object
        if (!parsedSong.title || !parsedSong.notes || !Array.isArray(parsedSong.notes)) {
          throw new Error('Invalid song schema. File must contain "title" and a "notes" array.');
        }

        // Re-generate ID to avoid duplicates and mark as custom
        parsedSong.id = `imported-song-${Date.now()}-${Math.random()}`;
        parsedSong.isCustom = true;

        addCustomSong(parsedSong);
        setActiveSong(parsedSong);

        setSuccessMessage(`"${parsedSong.title}" imported and loaded successfully!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err: any) {
        setErrorMessage(`Import error: ${err.message || 'Invalid JSON file format'}`);
      }
    };
    reader.readAsText(file);
    // Clear input
    e.target.value = '';
  };

  return (
    <div className="flex flex-col p-5 bg-surfaceLight/50 dark:bg-surfaceDark/50 rounded-2xl border border-glassBorderLight dark:border-glassBorderDark shadow-lg backdrop-blur-md h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FiFileText className="text-primaryColor dark:text-cyanColor h-5 w-5" />
          <h3 className="text-base font-bold text-textPrimaryLight dark:text-textPrimaryDark">
            Custom Song Creator
          </h3>
        </div>

        {/* Nifty action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadTemplate}
            className="text-[10px] font-bold px-2 py-1 bg-surfaceLight hover:bg-glassHoverLight dark:bg-surfaceDark dark:hover:bg-glassHoverDark border border-glassBorderLight dark:border-glassBorderDark rounded"
            title="Reset editor with template example"
          >
            Reset Template
          </button>
        </div>
      </div>

      {/* Code Textarea Editor */}
      <div className="relative flex-1 mb-4">
        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          placeholder="[SETTINGS]\ntitle=...\n\n[LYRICS]\n..."
          className="w-full h-[220px] p-3 rounded-lg border border-glassBorderLight bg-gray-50 text-[11px] font-mono text-gray-800 focus:border-primaryColor focus:outline-none dark:border-glassBorderDark dark:bg-gray-950 dark:text-gray-200 dark:focus:border-cyanColor resize-none"
        />
        <span className="absolute bottom-2.5 right-2.5 text-[9px] text-textSecondaryLight/50 dark:text-textSecondaryDark/40">
          Plain-Text Parser Mode
        </span>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="mb-4 text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg animate-pulse">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 text-xs font-semibold text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg flex items-center">
          <FiCheckCircle className="mr-1.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main bottom triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Parse & Play */}
        <button
          onClick={handleParseAndSave}
          className="flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-primaryColor to-cyanColor text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
        >
          <FiPlus className="mr-1.5 h-4 w-4" />
          <span>Parse & Save Song</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJSON}
          className="flex h-10 items-center justify-center rounded-xl border border-glassBorderLight bg-surfaceLight text-textSecondaryLight text-xs font-bold hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark shadow-sm transition-all"
        >
          <FiDownload className="mr-1.5 h-4 w-4 text-primaryColor dark:text-cyanColor" />
          <span>Export Loaded JSON</span>
        </button>

        {/* Import JSON file upload trigger */}
        <label className="flex h-10 items-center justify-center rounded-xl border border-glassBorderLight bg-surfaceLight text-textSecondaryLight text-xs font-bold hover:bg-glassHoverLight dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textSecondaryDark dark:hover:bg-glassHoverDark shadow-sm cursor-pointer transition-all">
          <FiUpload className="mr-1.5 h-4 w-4 text-accentColor" />
          <span>Import JSON Song</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
export default SongCreator;
