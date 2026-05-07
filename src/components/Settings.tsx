import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';
import { Moon, Sun, Save } from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onDarkModeChange }) => {
  const [engineDepth, setEngineDepth] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [boardSize, setBoardSize] = useState('medium');

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setEngineDepth(settings.engineDepth || 20);
      setSoundEnabled(settings.soundEnabled !== false);
      setAnimationsEnabled(settings.animationsEnabled !== false);
      setBoardSize(settings.boardSize || 'medium');
    }
  }, []);

  const handleSaveSettings = () => {
    const settings = {
      engineDepth,
      soundEnabled,
      animationsEnabled,
      boardSize
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Configure ChessDaddy to your preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h3>Appearance</h3>

          <div className="setting-item">
            <div className="setting-label">
              <span>Dark Mode</span>
            </div>
            <button
              className={`toggle-btn ${darkMode ? 'active' : ''}`}
              onClick={() => onDarkModeChange(!darkMode)}
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <div className="setting-item">
            <label htmlFor="boardSize">Board Size</label>
            <select
              id="boardSize"
              value={boardSize}
              onChange={(e) => setBoardSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Engine</h3>

          <div className="setting-item">
            <label htmlFor="engineDepth">Analysis Depth</label>
            <input
              id="engineDepth"
              type="range"
              min="10"
              max="30"
              value={engineDepth}
              onChange={(e) => setEngineDepth(Number(e.target.value))}
            />
            <span className="value-display">{engineDepth}</span>
          </div>
        </div>

        <div className="settings-section">
          <h3>Audio & Animations</h3>

          <div className="setting-item">
            <label htmlFor="sound">Sound Effects</label>
            <input
              id="sound"
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="animations">Animations</label>
            <input
              id="animations"
              type="checkbox"
              checked={animationsEnabled}
              onChange={(e) => setAnimationsEnabled(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <button className="save-btn" onClick={handleSaveSettings}>
        <Save size={18} />
        Save Settings
      </button>
    </div>
  );
};

export default Settings;