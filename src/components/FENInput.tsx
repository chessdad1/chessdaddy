import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import '../styles/FENInput.css';

interface FENInputProps {
  fen: string;
  onFenChange: (fen: string) => void;
  onClearBoard: () => void;
  onStartPosition: () => void;
}

const FENInput: React.FC<FENInputProps> = ({
  fen,
  onFenChange,
  onClearBoard,
  onStartPosition
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fen-input-section">
      <div className="fen-input-group">
        <label htmlFor="fen">FEN Notation</label>
        <div className="fen-input-wrapper">
          <input
            id="fen"
            type="text"
            value={fen}
            onChange={(e) => onFenChange(e.target.value)}
            placeholder="Paste FEN string here"
          />
          <button className="copy-btn" onClick={handleCopy} title="Copy FEN">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="fen-actions">
        <button onClick={onStartPosition} className="action-btn">
          Start Position
        </button>
        <button onClick={onClearBoard} className="action-btn danger">
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default FENInput;
