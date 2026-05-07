import React, { useState, useEffect } from 'react';
import '../styles/Chessboard.css';

interface ChessboardProps {
  fen: string;
  onMove?: (from: string, to: string) => void;
  readOnly?: boolean;
}

const SQUARE_SIZE = 60;
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const PIECE_UNICODE: { [key: string]: string } = {
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
};

const Chessboard: React.FC<ChessboardProps> = ({ fen, onMove, readOnly = false }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [board, setBoard] = useState<(string | null)[][]>([]);

  useEffect(() => {
    updateBoard(fen);
  }, [fen]);

  const updateBoard = (fen: string) => {
    const boardArray: (string | null)[][] = [];
    const fenParts = fen.split(' ');
    const position = fenParts[0];
    const rows = position.split('/');

    rows.forEach((row) => {
      const boardRow: (string | null)[] = [];
      for (const char of row) {
        if (isNaN(Number(char))) {
          boardRow.push(char);
        } else {
          for (let i = 0; i < Number(char); i++) {
            boardRow.push(null);
          }
        }
      }
      boardArray.push(boardRow);
    });

    setBoard(boardArray);
  };

  const handleSquareClick = (file: number, rank: number) => {
    if (readOnly) return;

    const square = `${FILES[file]}${RANKS[rank]}`;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (selectedSquare) {
      onMove?.(selectedSquare, square);
      setSelectedSquare(null);
      setLegalMoves([]);
    } else {
      setSelectedSquare(square);
      // In a real app, fetch legal moves for this square
      setLegalMoves([]);
    }
  };

  return (
    <div className="chessboard-wrapper">
      <div className="chessboard">
        {board.map((row, rankIdx) =>
          row.map((piece, fileIdx) => {
            const square = `${FILES[fileIdx]}${RANKS[rankIdx]}`;
            const isLight = (fileIdx + rankIdx) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);

            return (
              <div
                key={square}
                className={`square ${isLight ? 'light' : 'dark'} ${
                  isSelected ? 'selected' : ''
                } ${isLegalMove ? 'legal-move' : ''}`}
                onClick={() => handleSquareClick(fileIdx, rankIdx)}
              >
                {piece && (
                  <span className="piece">{PIECE_UNICODE[piece]}</span>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="board-labels">
        <div className="file-labels">
          {FILES.map((file) => (
            <div key={file} className="file-label">
              {file}
            </div>
          ))}
        </div>
        <div className="rank-labels">
          {RANKS.map((rank) => (
            <div key={rank} className="rank-label">
              {rank}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chessboard;