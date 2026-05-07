import React, { useState, useEffect } from 'react';
import '../styles/OpeningExplorer.css';
import Chessboard from './Chessboard';
import { OpeningBook } from '../services/OpeningBook';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Chess } from 'chess.js';

interface OpeningMove {
  move: string;
  stats: {
    totalGames: number;
    whiteWins: number;
    draws: number;
    blackWins: number;
    whiteScore: number;
    drawScore: number;
    blackScore: number;
  };
  popularity: number;
}

const OpeningExplorer: React.FC = () => {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [moves, setMoves] = useState<OpeningMove[]>([]);
  const [loading, setLoading] = useState(false);
  const [openingBook] = useState(new OpeningBook());

  useEffect(() => {
    loadOpeningMoves(fen);
  }, [fen]);

  const loadOpeningMoves = async (position: string) => {
    setLoading(true);
    try {
      const stats = await openingBook.getOpeningStats(position);
      setMoves(stats);
    } catch (error) {
      console.error('Failed to load opening stats:', error);
      setMoves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = (from: string, to: string) => {
    const moveObj = chess.move({ from, to });
    if (moveObj) {
      const newFen = chess.fen();
      setFen(newFen);
    }
  };

  const handleReset = () => {
    chess.reset();
    setFen(chess.fen());
  };

  const handleUndo = () => {
    chess.undo();
    setFen(chess.fen());
  };

  const getWinRate = (move: OpeningMove) => {
    const total =
      move.stats.whiteWins +
      move.stats.draws +
      move.stats.blackWins;
    if (total === 0) return 0;
    return Math.round(
      ((move.stats.whiteWins + move.stats.draws * 0.5) / total) * 100
    );
  };

  return (
    <div className="opening-explorer">
      <div className="explorer-header">
        <h2>♗ Opening Explorer</h2>
        <p>Explore statistics from master games</p>
      </div>

      <div className="explorer-container">
        <div className="explorer-board-section">
          <Chessboard fen={fen} onMove={handleMove} />
          <div className="board-actions">
            <button onClick={handleReset} className="action-btn">Reset</button>
            <button onClick={handleUndo} className="action-btn">Undo</button>
          </div>
        </div>

        <div className="explorer-stats">
          <div className="stats-header">
            <h3>
              <BarChart3 size={20} />
              Top Moves
            </h3>
            {loading && <span className="loading">Loading...</span>}
          </div>

          {moves.length > 0 ? (
            <div className="moves-list">
              {moves.slice(0, 10).map((move, idx) => (
                <div key={idx} className="move-stat">
                  <div className="move-header">
                    <span className="move-name">{move.move}</span>
                    <span className="popularity">{Math.round(move.popularity * 100)}%</span>
                  </div>
                  <div className="win-rate-bar">
                    <div
                      className="white-segment"
                      style={{
                        width: `${move.stats.whiteScore * 100}%`
                      }}
                      title={`White wins: ${move.stats.whiteWins}`}
                    />
                    <div
                      className="draw-segment"
                      style={{
                        width: `${move.stats.drawScore * 100}%`
                      }}
                      title={`Draws: ${move.stats.draws}`}
                    />
                    <div
                      className="black-segment"
                      style={{
                        width: `${move.stats.blackScore * 100}%`
                      }}
                      title={`Black wins: ${move.stats.blackWins}`}
                    />
                  </div>
                  <div className="move-stats">
                    <span className="games">{move.stats.totalGames} games</span>
                    <span className="win-rate">{getWinRate(move)}% for white</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <TrendingUp size={32} />
              <p>No opening data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpeningExplorer;