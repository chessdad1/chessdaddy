import { Chess } from 'chess.js';
import { StockfishWorker, EngineEvaluation } from './StockfishWorker';
import { MoveClassifier, MoveType, MoveClassification } from './MoveClassifier';

export interface GameAnalysis {
  totalMoves: number;
  accuracy: number;
  bestMoveCount: number;
  greatMoveCount: number;
  goodMoveCount: number;
  inaccuracyCount: number;
  mistakeCount: number;
  blunderCount: number;
  brilliantMoveCount: number;
  moveAnalyses: MoveClassification[];
  principalVariations: string[][];
}

export class GameAnalyzer {
  private engine: StockfishWorker;
  private classifier: MoveClassifier;

  constructor() {
    this.engine = new StockfishWorker();
    this.classifier = new MoveClassifier();
  }

  /**
   * Analyze an entire game
   */
  async analyzeGame(
    pgn: string,
    depth: number = 20,
    onProgress?: (progress: number) => void
  ): Promise<GameAnalysis> {
    const chess = new Chess();
    const moves: string[] = [];
    const analyses: MoveClassification[] = [];
    const variations: string[][] = [];

    // Extract moves from PGN
    try {
      chess.load_pgn(pgn);
    } catch (e) {
      throw new Error('Invalid PGN format');
    }

    chess.reset();
    const pgnMoves = chess.moves({ verbose: true });

    // Analyze each move
    for (let i = 0; i < pgnMoves.length; i++) {
      const move = pgnMoves[i];

      // Get evaluation before move
      const beforeEval = await this.engine.evaluatePosition(chess.fen(), depth);

      // Make move
      chess.move(move);
      moves.push(`${move.from}${move.to}`);

      // Get evaluation after move
      const afterEval = await this.engine.evaluatePosition(
        chess.fen(),
        depth
      );

      // Get best move
      const bestMove = await this.engine.getBestMove(chess.fen(), depth);
      const bestEval = await this.engine.evaluatePosition(chess.fen(), depth);

      // Detect sacrifice
      const isSacrifice = this.detectSacrifice(
        move,
        beforeEval,
        afterEval,
        chess
      );

      // Classify move
      const classification = this.classifier.classify(
        beforeEval,
        afterEval,
        isSacrifice
      );

      const accuracy = this.classifier.calculateAccuracy(
        Math.abs(beforeEval - afterEval)
      );

      analyses.push({
        move: `${move.from}${move.to}`,
        classification,
        playerEval: afterEval,
        bestEval: bestEval,
        accuracy
      });

      // Get principal variation
      const pv = await this.engine.getPrincipalVariation(
        chess.fen(),
        depth
      );
      variations.push(pv);

      // Progress callback
      if (onProgress) {
        onProgress((i + 1) / pgnMoves.length);
      }
    }

    // Calculate statistics
    return this.calculateStatistics(analyses);
  }

  /**
   * Analyze a single position
   */
  async analyzePosition(
    fen: string,
    depth: number = 20
  ): Promise<EngineEvaluation> {
    return this.engine.analyze(fen, depth);
  }

  /**
   * Detect if a move is a sacrifice
   */
  private detectSacrifice(
    move: any,
    beforeEval: number,
    afterEval: number,
    chess: Chess
  ): boolean {
    const piece = chess.get(move.from);
    if (!piece) return false;

    // Material values
    const materialValues: { [key: string]: number } = {
      p: 100,
      n: 300,
      b: 300,
      r: 500,
      q: 900,
      k: 0
    };

    const pieceLost =
      materialValues[piece.type.toLowerCase()] || 0;

    // Sacrifice if material loss but position improves
    return (
      pieceLost > 0 &&
      afterEval > beforeEval + 200 &&
      (move.flags.includes('c') || move.flags.includes('e')) // Capture or en passant
    );
  }

  /**
   * Calculate game statistics
   */
  private calculateStatistics(analyses: MoveClassification[]): GameAnalysis {
    const stats = {
      totalMoves: analyses.length,
      accuracy: 0,
      bestMoveCount: 0,
      greatMoveCount: 0,
      goodMoveCount: 0,
      inaccuracyCount: 0,
      mistakeCount: 0,
      blunderCount: 0,
      brilliantMoveCount: 0,
      moveAnalyses: analyses,
      principalVariations: []
    };

    let totalAccuracy = 0;

    for (const analysis of analyses) {
      totalAccuracy += analysis.accuracy;

      switch (analysis.classification) {
        case MoveType.BEST:
          stats.bestMoveCount++;
          break;
        case MoveType.GREAT:
          stats.greatMoveCount++;
          break;
        case MoveType.GOOD:
          stats.goodMoveCount++;
          break;
        case MoveType.INACCURACY:
          stats.inaccuracyCount++;
          break;
        case MoveType.MISTAKE:
          stats.mistakeCount++;
          break;
        case MoveType.BLUNDER:
          stats.blunderCount++;
          break;
        case MoveType.BRILLIANT:
          stats.brilliantMoveCount++;
          break;
      }
    }

    stats.accuracy = Math.round(totalAccuracy / analyses.length);

    return stats;
  }
}
