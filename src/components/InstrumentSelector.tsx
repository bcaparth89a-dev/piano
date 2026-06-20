import React from 'react';
import { usePianoStore } from '../store/settings';

const INSTRUMENTS_PRESETS = [
  { id: 'piano', name: 'Concert Grand Piano' },
  { id: 'upright-piano', name: 'Upright Piano' },
  { id: 'electric-piano', name: 'Electric Piano' },
  { id: 'jazz-piano', name: 'Jazz Piano' },
  { id: 'bright-piano', name: 'Bright Piano' },
  { id: 'honky-tonk', name: 'Honky-Tonk Piano' },
  { id: 'organ', name: 'Organ' },
  { id: 'harpsichord', name: 'Harpsichord' },
  { id: 'strings', name: 'Strings Ensemble' },
  { id: 'synth', name: 'Polyphonic Synth' },
  { id: 'guitar-acoustic', name: 'Acoustic Guitar' },
  { id: 'bass-electric', name: 'Electric Bass' },
];

export const InstrumentSelector: React.FC = () => {
  const currentInstrument = usePianoStore((s) => s.instrument);
  const setInstrument = usePianoStore((s) => s.setInstrument);

  return (
    <div className="flex flex-col min-w-[200px]">
      <label className="mb-1 text-[10px] font-bold uppercase tracking-wider text-textSecondaryLight dark:text-textSecondaryDark/50">
        Instrument Voice
      </label>
      
      <select
        value={currentInstrument}
        onChange={(e) => setInstrument(e.target.value)}
        className="w-full h-10 px-3 pr-8 rounded-lg appearance-none cursor-pointer border border-glassBorderLight bg-surfaceLight text-sm font-semibold text-textPrimaryLight hover:bg-glassHoverLight focus:border-primaryColor focus:outline-none dark:border-glassBorderDark dark:bg-surfaceDark dark:text-textPrimaryDark dark:hover:bg-glassHoverDark dark:focus:border-cyanColor transition-all duration-200"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {INSTRUMENTS_PRESETS.map((inst) => (
          <option key={inst.id} value={inst.id} className="dark:bg-surfaceDark font-semibold text-sm">
            {inst.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default InstrumentSelector;
