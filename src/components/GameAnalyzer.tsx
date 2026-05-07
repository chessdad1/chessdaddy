import React, { useState, useEffect } from 'react';
import '../styles/GameAnalyzer.css';
import { AlertCircle, Download, BarChart3 } from 'lucide-react';
import { ChessComAPI } from '../services/ChessComAPI';
import { GameAnalyzer as GameAnalyzerService } from '../services/GameAnalyzer';
import { PGNParser } from '../services/PGNParser';
import Chessboard from './Chessboard';

interface Game {
  white: { username: string; rating: number; result?: string };
  black: { username: string; rating: number; result?: string };
  pgn?: string;
  time_control: string;
  end_time: number;
}

interface GameAnalysisResult {
  totalMoves: number;
  accuracy: number;
  bestMoveCount: number;
  greatMoveCount: number;
  goodMoveCount: number;
  inaccuracyCount: number;
  mistakeCount: number;
  blunderCount: number;
}

const GameAnalyzerComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [analysis, setAnalysis] = useState<GameAnalysisResult | null>(null);
  const [gameBoard, setGameBoard] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('chesscomUsername');
    if (saved) {
      setUsername(saved);
    }
  }, []);

  const handleFetchGames = async () => {
    if (!username.trim()) {
      setError('Please enter a Chess.com username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const api = new ChessComAPI();
      const fetchedGames = await api.fetchUserGames(username);
      if (fetchedGames.length === 0) {
        setError('No games found for this username');
      } else {
        setGames(fetchedGames);
        localStorage.setItem('chesscomUsername', username);
      }
    } catch (err) {
      setError('Failed to fetch games. Check the username and internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeGame = async (game: Game) => {
    if (!game.pgn) {
      setError('No PGN data available for this game');
      return;
    }

    setSelectedGame(game);
    setAnalyzing(true);
    setError('');

    try {
      const analyzer = new GameAnalyzerService();
      const result = await analyzer.analyzeGame(game.pgn, 20, (progress: number) => {
        console.log(`Analysis progress: ${(progress * 100).toFixed(0)}%`);
      });

      setAnalysis({
        totalMoves: result.totalMoves,
        accuracy: result.accuracy,
        bestMoveCount: result.bestMoveCount,
        greatMoveCount: result.greatMoveCount,
        goodMoveCount: result.goodMoveCount,
        inaccuracyCount: result.inaccuracyCount,
        mistakeCount: result.mistakeCount,
        blunderCount: result.blunderCount
      });

      // Load game position
      const parsedGame = PGNParser.parseGame(game.pgn);
      setGameBoard(game.pgn);
    } catch (err) {
      setError('Failed to analyze game: ' + String(err));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="game-analyzer">
      <div className="analyzer-header">
        <h2>Chess.com Game Analyzer</h2>
        <p>Analyze your games with Stockfish engine</p>
      </div>

      <div className="username-input-section">
        <input
          type="text"
          placeholder="Enter Chess.com username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleFetchGames()}
        />
        <button onClick={handleFetchGames} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Games'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {games.length > 0 && (
        <div className="games-section">
          <h3>{games.length} Games Found</h3>
          <div className="games-grid">
            {games.map((game, index) => (
              <div
                key={index}
                className={`game-card ${selectedGame === game ? 'selected' : ''}`}
              >
                <div className="game-info">
                  <div className="players">
                    <span className="white">{game.white.username}</span>
                    <span className="vs">vs</span>
                    <span className="black">{game.black.username}</span>
                  </div>
                  <div className="ratings">
                    <span>{game.white.rating}</span>
                    <span>{game.black.rating}</span>
                  </div>
                  <div className="meta">
                    <span>{game.time_control}</span>
                  </div>
                </div>
                <button
                  className="analyze-btn"
                  onClick={() => handleAnalyzeGame(game)}
                  disabled={analyzing}
                >
                  {analyzing && selectedGame === game ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedGame && analysis && (
        <div className="analysis-results">
          <div className="results-header">
            <h3>
              <BarChart3 size={20} />
              Game Analysis Results
            </h3>
          </div>
          <div className="analysis-grid">
            <div className="analysis-card primary">
              <p className="label">Accuracy</p>
              <p className="value">{analysis.accuracy}%</p>
            </div>
            <div className="analysis-card">
              <p className="label">Best Moves</p>
              <p className="value">{analysis.bestMoveCount}</p>
            </div>
            <div className="analysis-card">
              <p className="label">Good Moves</p>
              <p className="value">{analysis.goodMoveCount}</p>
            </div>
            <div className="analysis-card warning">
              <p className="label">Inaccuracies</p>
              <p className="value">{analysis.inaccuracyCount}</p>
            </div>
            <div className="analysis-card danger">
              <p className="label">Mistakes</p>
              <p className="value">{analysis.mistakeCount}</p>
            </div>
            <div className="analysis-card critical">
              <p className="label">Blunders</p>
              <p className="value">{analysis.blunderCount}</p>
            </div>
          </div>

          <div className="download-section">
            <button className="export-btn">
              <Download size={18} />
              Export Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameAnalyzerComponent;