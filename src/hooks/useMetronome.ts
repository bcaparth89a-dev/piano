import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { usePianoStore } from '../store/settings';

export const useMetronome = (onTick: (beat: number) => void) => {
  const bpm = usePianoStore((s) => s.metronomeBpm);
  const metronomeOn = usePianoStore((s) => s.metronomeOn);

  const clickSynthRef = useRef<Tone.Synth | null>(null);
  const repeatIdRef = useRef<number | null>(null);
  const beatCounter = useRef(0);

  // Initialize Metronome click synthesizer
  useEffect(() => {
    clickSynthRef.current = new Tone.Synth({
      oscillator: { type: 'triangle' }, // warm click
      envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
    }).toDestination();
    clickSynthRef.current.volume.value = -6; // slightly lower volume than keys

    return () => {
      if (clickSynthRef.current) {
        clickSynthRef.current.dispose();
      }
    };
  }, []);

  // Sync BPM changes to Tone.js Transport
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  // Handle metronome start/stop scheduler loop
  useEffect(() => {
    const transport = Tone.getTransport();

    if (metronomeOn) {
      // Start audio context if needed
      if (Tone.context.state !== 'running') {
        Tone.start();
      }

      beatCounter.current = 0;

      // Schedule recurring ticks every quarter note ('4n')
      repeatIdRef.current = transport.scheduleRepeat((time) => {
        const synth = clickSynthRef.current;
        if (!synth) return;

        const currentBeat = beatCounter.current % 4;

        if (currentBeat === 0) {
          // Pitch-shift high on downbeat (Beat 1)
          synth.triggerAttackRelease('C6', '16n', time, 1.0);
        } else {
          synth.triggerAttackRelease('G5', '16n', time, 0.6);
        }

        // Draw visual syncing on the main UI thread at exact audio trigger time
        Tone.Draw.schedule(() => {
          onTick(currentBeat);
        }, time);

        beatCounter.current++;
      }, '4n');

      // Start the transport timeline
      transport.start();
    } else {
      // Stop and clear scheduling
      if (repeatIdRef.current !== null) {
        transport.clear(repeatIdRef.current);
        repeatIdRef.current = null;
      }
      transport.stop();
    }

    return () => {
      if (repeatIdRef.current !== null) {
        transport.clear(repeatIdRef.current);
      }
    };
  }, [metronomeOn, onTick]);
};
export default useMetronome;
