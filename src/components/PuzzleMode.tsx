import React, { useState, useEffect } from 'react';
import '../styles/PuzzleMode.css';
import Chessboard from './Chessboard';
import { PuzzleSystem } from '../services/PuzzleSystem';
import { Zap, Award, TrendingUp } from 'lucide-react';

const PuzzleMode: React.FC = () => {
  const [puzzleSystem] = useState(new PuzzleSystem());
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzleSystem.getNextPuzzle());
  const [stats, setStats] = useState(puzzleSystem.getStats());
  const [moveCount, setMoveCount] = useState(0);
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    puzzleSystem.loadStats();
    setStats(puzzleSystem.getStats());
  }, [puzzleSystem]);

  const handleMove = (from: string, to: string) => {
    if (solved) return;

    const moves = [`${from}${to}`];
    const isCorrect = puzzleSystem.verifyMove(currentPuzzle, moves);

    if (isCorrect) {
      setSolved(true);
      setMessage('✓ Correct! Great move!');
      puzzleSystem.recordAttempt(currentPuzzle, true);
      setStats(puzzleSystem.getStats());

      setTimeout(() => {
        loadNextPuzzle();
      }, 1500);
    } else {
      setMessage('✗ Not the solution. Try again!');
    }
  };

  const loadNextPuzzle = () => {
    const next = puzzleSystem.getNextPuzzle();
    setCurrentPuzzle(next);
    setMoveCount(0);
    setMessage('');
    setSolved(false);
  };

  const handleSkip = () => {
    if (moveCount > 0) {
      puzzleSystem.recordAttempt(currentPuzzle, false);
      setStats(puzzleSystem.getStats());
    }
    loadNextPuzzle();
  };

  return (
    <div className="puzzle-mode">
      <div className="puzzle-header">
        <h2>♞ Puzzle Rush</h2>
        <div className="stats-bar">
          <div className="stat">
            <Zap size={20} />
            <div>
              <span className="label">Streak</span>
              <span className="value">{stats.streak}</span>
            </div>
          </div>
          <div className="stat">
            <Award size={20} />
            <div>
              <span className="label">Solved</span>
              <span className="value">{stats.solved}</span>
            </div>
          </div>
          <div className="stat">
            <TrendingUp size={20} />
            <div>
              <span className="label">Rating</span>
              <span className="value">{stats.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="puzzle-container">
        <div className="puzzle-board">
          <Chessboard fen={currentPuzzle.fen} onMove={handleMove} />
          <div className="puzzle-info">
            <p className="puzzle-theme">Theme: {currentPuzzle.theme}</p>
            <p className="puzzle-rating">Difficulty: {currentPuzzle.difficulty}</p>
          </div>
        </div>

        <div className="puzzle-sidebar">
          <div className="puzzle-instructions">
            <h3>Find the best move</h3>
            <p className="instruction-text">
              White to move. Find the forcing sequence that wins material or delivers mate.
            </p>
            {message && (
              <div className={`message ${solved ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="puzzle-stats">
            <div className="stat-item">
              <span className="label">Attempts</span>
              <span className="value">{stats.attempts}</span>
            </div>
            <div className="stat-item">
              <span className="label">Success Rate</span>
              <span className="value">
                {stats.attempts === 0
                  ? '0'
                  : Math.round((stats.solved / stats.attempts) * 100)}%
              </span>
            </div>
          </div>

          <div className="puzzle-actions">
            <button className="hint-btn" disabled>
              💡 Hint
            </button>
            <button onClick={handleSkip} className="skip-btn">
              Skip Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleMode;
