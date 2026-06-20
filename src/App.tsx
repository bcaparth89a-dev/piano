import { useEffect, useState } from 'react';
import Home from './pages/Home';
import DeveloperProfile from './pages/DeveloperProfile';
import { usePianoStore } from './store/settings';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const theme = usePianoStore((s) => s.theme);
  const activePage = usePianoStore((s) => s.activePage);
  const [showSplash, setShowSplash] = useState(true);

  // Sync document class with selected theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return activePage === 'developer' ? <DeveloperProfile /> : <Home />;
}

export default App;

