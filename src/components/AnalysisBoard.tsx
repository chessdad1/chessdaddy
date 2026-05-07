import React, { useState, useEffect } from 'react';
import '../styles/AnalysisBoard.css';
import Chessboard from './Chessboard';
import EngineEvaluation from './EngineEvaluation';
import MoveHistory from './MoveHistory';
import FENInput from './FENInput';
import FileUpload from './FileUpload';
import EvaluationBar from './EvaluationBar';
import { StockfishWorker } from '../services/StockfishWorker';
import { Chess } from 'chess.js';
import { PGNParser } from '../services/PGNParser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';

const AnalysisBoard: React.FC = () => {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [evaluation, setEvaluation] = useState<number>(0);
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [depth, setDepth] = useState(20);
  const [pgn, setPgn] = useState('');
  const [analysisDepth, setAnalysisDepth] = useState(20);

  const engine = new StockfishWorker();

  useEffect(() => {
    engine.initialize();
  }, []);

  const handleMove = (sourceSquare: string, targetSquare: string) => {
    const moves = chess.moves({ verbose: true });
    const move = moves.find(
      (m) => m.from === sourceSquare && m.to === targetSquare
    );

    if (move) {
      chess.move(move);
      const newFen = chess.fen();
      setFen(newFen);
      setMoveHistory([...moveHistory, `${sourceSquare}${targetSquare}`]);
      analyzePosition(newFen);
    }
  };

  const analyzePosition = async (position: string) => {
    setIsAnalyzing(true);
    try {
      const eval = await engine.evaluatePosition(position, analysisDepth);
      const best = await engine.getBestMove(position, analysisDepth);
      setEvaluation(eval);
      setBestMove(best);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFENChange = (newFen: string) => {
    try {
      chess.load(newFen);
      setFen(newFen);
      analyzePosition(newFen);
    } catch (error) {
      alert('Invalid FEN');
    }
  };

  const handlePGNUpload = (content: string) => {
    try {
      if (PGNParser.isValidPGN(content)) {
        setPgn(content);
        const game = PGNParser.parseGame(content);
        chess.reset();
        
        for (const move of game.moves) {
          try {
            chess.move(move, { sloppy: true });
          } catch (e) {
            break;
          }
        }
        
        setFen(chess.fen());
        setMoveHistory(game.moves);
        analyzePosition(chess.fen());
      } else {
        alert('Invalid PGN format');
      }
    } catch (error) {
      alert('Error parsing PGN');
    }
  };

  const handleClearBoard = () => {
    chess.reset();
    setFen(chess.fen());
    setMoveHistory([]);
    setEvaluation(0);
    setBestMove(null);
  };

  const handleStartPosition = () => {
    chess.reset();
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    handleFENChange(startFen);
  };

  const handleUndo = () => {
    chess.undo();
    setFen(chess.fen());
    const newHistory = moveHistory.slice(0, -1);
    setMoveHistory(newHistory);
    analyzePosition(chess.fen());
  };

  return (
    <div className="analysis-board-container">
      <div className="board-section">
        <Chessboard fen={fen} onMove={handleMove} />
        <div className="board-controls">
          <button onClick={handleUndo} disabled={moveHistory.length === 0} className="control-btn">
            ↶ Undo
          </button>
          <button onClick={handleClearBoard} className="control-btn">
            Clear
          </button>
        </div>
      </div>

      <div className="analysis-section">
        <Tabs defaultValue="analysis">
          <TabsList>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="pgn">PGN</TabsTrigger>
            <TabsTrigger value="fen">FEN</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <EngineEvaluation
              evaluation={evaluation}
              bestMove={bestMove}
              isAnalyzing={isAnalyzing}
            />
            <EvaluationBar whiteEval={evaluation} blackEval={-evaluation} />
            <div className="depth-control">
              <label htmlFor="depth">Analysis Depth: {analysisDepth}</label>
              <input
                id="depth"
                type="range"
                min="10"
                max="30"
                value={analysisDepth}
                onChange={(e) => setAnalysisDepth(Number(e.target.value))}
              />
            </div>
            <MoveHistory moves={moveHistory} />
          </TabsContent>

          <TabsContent value="pgn">
            <div className="pgn-section">
              <h3>Import PGN</h3>
              <FileUpload onFileSelect={handlePGNUpload} />
              <div className="pgn-text-area">
                <textarea
                  value={pgn}
                  onChange={(e) => setPgn(e.target.value)}
                  placeholder="Paste PGN here or upload file"
                />
                <button
                  onClick={() => handlePGNUpload(pgn)}
                  className="primary-btn"
                >
                  Load PGN
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fen">
            <FENInput
              fen={fen}
              onFenChange={handleFENChange}
              onClearBoard={handleClearBoard}
              onStartPosition={handleStartPosition}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisBoard;
