import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Sidebar from './components/Sidebar';
import AnalysisBoard from './components/AnalysisBoard';
import GameAnalyzer from './components/GameAnalyzer';
import PuzzleMode from './components/PuzzleMode';
import OpeningExplorer from './components/OpeningExplorer';
import Settings from './components/Settings';

type Page = 'analysis' | 'games' | 'puzzles' | 'openings' | 'settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('analysis');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from storage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'analysis' && <AnalysisBoard />}
        {currentPage === 'games' && <GameAnalyzer />}
        {currentPage === 'puzzles' && <PuzzleMode />}
        {currentPage === 'openings' && <OpeningExplorer />}
        {currentPage === 'settings' && (
          <Settings darkMode={darkMode} onDarkModeChange={setDarkMode} />
        )}
      </main>
    </div>
  );
};

export default App;