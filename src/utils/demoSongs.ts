export interface DemoNote {
  note: string;
  time: number; // in milliseconds from start
  duration: number; // in milliseconds
}

export interface DemoSong {
  name: string;
  composer: string;
  notes: DemoNote[];
  duration: number; // in milliseconds
}

export const DEMO_SONGS: Record<string, DemoSong> = {
  furElise: {
    name: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    duration: 6500,
    notes: [
      { note: 'E5', time: 0, duration: 200 },
      { note: 'D#5', time: 250, duration: 200 },
      { note: 'E5', time: 500, duration: 200 },
      { note: 'D#5', time: 750, duration: 200 },
      { note: 'E5', time: 1000, duration: 200 },
      { note: 'B4', time: 1250, duration: 200 },
      { note: 'D5', time: 1500, duration: 200 },
      { note: 'C5', time: 1750, duration: 200 },
      { note: 'A4', time: 2000, duration: 400 },
      
      { note: 'C3', time: 2250, duration: 200 },
      { note: 'E3', time: 2250, duration: 200 },
      { note: 'A3', time: 2250, duration: 200 },
      
      { note: 'C4', time: 2400, duration: 200 },
      { note: 'E4', time: 2650, duration: 200 },
      { note: 'A4', time: 2900, duration: 200 },
      { note: 'B4', time: 3150, duration: 400 },
      
      { note: 'E3', time: 3400, duration: 200 },
      { note: 'G#3', time: 3400, duration: 200 },
      { note: 'B3', time: 3400, duration: 200 },
      
      { note: 'E4', time: 3550, duration: 200 },
      { note: 'G#4', time: 3800, duration: 200 },
      { note: 'B4', time: 4050, duration: 200 },
      { note: 'C5', time: 4300, duration: 400 },
      
      { note: 'A3', time: 4550, duration: 200 },
      { note: 'E3', time: 4550, duration: 200 },
      
      { note: 'E4', time: 4700, duration: 200 },
      { note: 'E5', time: 4950, duration: 200 },
      { note: 'D#5', time: 5200, duration: 200 },
      { note: 'E5', time: 5450, duration: 200 },
      { note: 'D#5', time: 5700, duration: 200 },
      { note: 'E5', time: 5950, duration: 200 },
      { note: 'B4', time: 6200, duration: 200 },
    ],
  },
  odeToJoy: {
    name: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    duration: 6800,
    notes: [
      { note: 'E4', time: 0, duration: 300 },
      { note: 'E4', time: 400, duration: 300 },
      { note: 'F4', time: 800, duration: 300 },
      { note: 'G4', time: 1200, duration: 300 },
      { note: 'G4', time: 1600, duration: 300 },
      { note: 'F4', time: 2000, duration: 300 },
      { note: 'E4', time: 2400, duration: 300 },
      { note: 'D4', time: 2800, duration: 300 },
      { note: 'C4', time: 3200, duration: 300 },
      { note: 'C4', time: 3600, duration: 300 },
      { note: 'D4', time: 4000, duration: 300 },
      { note: 'E4', time: 4400, duration: 300 },
      { note: 'E4', time: 4800, duration: 450 },
      { note: 'D4', time: 5300, duration: 150 },
      { note: 'D4', time: 5500, duration: 600 },
      
      { note: 'C3', time: 5500, duration: 600 },
      { note: 'G3', time: 5500, duration: 600 },
    ],
  },
  minuetG: {
    name: 'Minuet in G Major',
    composer: 'Christian Petzold (J.S. Bach)',
    duration: 7200,
    notes: [
      { note: 'D5', time: 0, duration: 350 },
      { note: 'G4', time: 500, duration: 200 },
      { note: 'A4', time: 750, duration: 200 },
      { note: 'B4', time: 1000, duration: 200 },
      { note: 'C5', time: 1250, duration: 200 },
      { note: 'D5', time: 1500, duration: 350 },
      { note: 'G4', time: 2000, duration: 350 },
      { note: 'G4', time: 2500, duration: 350 },
      
      { note: 'E5', time: 3000, duration: 350 },
      { note: 'C5', time: 3500, duration: 200 },
      { note: 'D5', time: 3750, duration: 200 },
      { note: 'E5', time: 4000, duration: 200 },
      { note: 'F#5', time: 4250, duration: 200 },
      { note: 'G5', time: 4500, duration: 350 },
      { note: 'G4', time: 5000, duration: 350 },
      { note: 'G4', time: 5500, duration: 350 },

      { note: 'C5', time: 6000, duration: 350 },
      { note: 'D5', time: 6500, duration: 200 },
      { note: 'C5', time: 6750, duration: 200 },
      { note: 'B4', time: 7000, duration: 200 },
    ]
  },
  mereSapnoKiRani: {
    name: 'Mere Sapno Ki Rani',
    composer: 'S. D. Burman',
    duration: 11800,
    notes: [
      { note: 'C5', time: 0, duration: 300 },
      { note: 'E5', time: 400, duration: 300 },
      { note: 'F5', time: 800, duration: 300 },
      { note: 'G5', time: 1200, duration: 300 },
      { note: 'E5', time: 1600, duration: 300 },
      { note: 'D5', time: 2000, duration: 300 },
      { note: 'C5', time: 2400, duration: 600 },
      { note: 'E5', time: 3200, duration: 300 },
      { note: 'G5', time: 3600, duration: 300 },
      { note: 'A5', time: 4000, duration: 300 },
      { note: 'G5', time: 4400, duration: 300 },
      { note: 'F5', time: 4800, duration: 300 },
      { note: 'E5', time: 5200, duration: 300 },
      { note: 'D5', time: 5600, duration: 300 },
      { note: 'C5', time: 6000, duration: 600 },
      { note: 'D5', time: 7000, duration: 300 },
      { note: 'E5', time: 7400, duration: 300 },
      { note: 'F5', time: 7800, duration: 300 },
      { note: 'G5', time: 8200, duration: 300 },
      { note: 'A5', time: 8600, duration: 300 },
      { note: 'G5', time: 9000, duration: 300 },
      { note: 'F5', time: 9400, duration: 300 },
      { note: 'E5', time: 9800, duration: 300 },
      { note: 'D5', time: 10200, duration: 300 },
      { note: 'C5', time: 10600, duration: 600 },
    ]
  },
  jaiHo: {
    name: 'Jai Ho',
    composer: 'A. R. Rahman',
    duration: 10000,
    notes: [
      { note: 'D5', time: 0, duration: 250 },
      { note: 'D5', time: 300, duration: 250 },
      { note: 'E5', time: 600, duration: 250 },
      { note: 'F#5', time: 900, duration: 250 },
      { note: 'E5', time: 1200, duration: 250 },
      { note: 'D5', time: 1500, duration: 250 },
      { note: 'C#5', time: 1800, duration: 250 },
      { note: 'D5', time: 2100, duration: 250 },
      { note: 'E5', time: 2400, duration: 250 },
      { note: 'F#5', time: 2700, duration: 250 },
      { note: 'G5', time: 3000, duration: 250 },
      { note: 'F#5', time: 3300, duration: 250 },
      { note: 'E5', time: 3600, duration: 250 },
      { note: 'D5', time: 3900, duration: 350 },
      { note: 'C#5', time: 4300, duration: 250 },
      { note: 'D5', time: 4600, duration: 250 },
      { note: 'E5', time: 4900, duration: 250 },
      { note: 'F#5', time: 5200, duration: 250 },
      { note: 'E5', time: 5500, duration: 250 },
      { note: 'D5', time: 5800, duration: 250 },
      { note: 'C#5', time: 6100, duration: 250 },
      { note: 'B4', time: 6400, duration: 250 },
      { note: 'A4', time: 6700, duration: 250 },
      { note: 'D5', time: 7000, duration: 250 },
      { note: 'E5', time: 7300, duration: 250 },
      { note: 'F#5', time: 7600, duration: 250 },
      { note: 'G5', time: 7900, duration: 250 },
      { note: 'F#5', time: 8200, duration: 250 },
      { note: 'E5', time: 8500, duration: 250 },
      { note: 'D5', time: 8800, duration: 1200 },
    ]
  }
};
export default DEMO_SONGS;
