import { Chess } from 'chess.js';
import { StockfishWorker } from './StockfishWorker';

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  theme: string;
  difficulty: number;
  rating: number;
  source: string;
}

export interface PuzzleStats {
  solved: number;
  attempts: number;
  rating: number;
  streak: number;
}

export class PuzzleSystem {
  private engine: StockfishWorker;
  private puzzles: Puzzle[] = [];
  private stats: PuzzleStats = {
    solved: 0,
    attempts: 0,
    rating: 1200,
    streak: 0
  };

  constructor() {
    this.engine = new StockfishWorker();
    this.loadPuzzles();
  }

  /**
   * Load puzzles from local storage or database
   */
  private loadPuzzles(): void {
    // In a real app, load from database or file
    // For now, use demo puzzles
    const demoSamplePuzzles: Puzzle[] = [
      {
        id: 'puzzle_1',
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
        solution: ['b5c6'],
        theme: 'fork',
        difficulty: 1000,
        rating: 1200,
        source: 'demo'
      },
      {
        id: 'puzzle_2',
        fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
        solution: ['g2g4', 'g8f8', 'g4g5'],
        theme: 'pawn_endgame',
        difficulty: 800,
        rating: 1000,
        source: 'demo'
      },
      {
        id: 'puzzle_3',
        fen: '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',
        solution: ['f7f8'],
        theme: 'mate_in_one',
        difficulty: 500,
        rating: 800,
        source: 'demo'
      }
    ];

    this.puzzles = demoSamplePuzzles;
  }

  /**
   * Get next puzzle based on user rating
   */
  getNextPuzzle(): Puzzle {
    // Filter puzzles by difficulty range
    const minDifficulty = Math.max(500, this.stats.rating - 300);
    const maxDifficulty = Math.min(3000, this.stats.rating + 300);

    const suitable = this.puzzles.filter(
      (p) => p.difficulty >= minDifficulty && p.difficulty <= maxDifficulty
    );

    if (suitable.length === 0) {
      return this.puzzles[Math.floor(Math.random() * this.puzzles.length)];
    }

    return suitable[Math.floor(Math.random() * suitable.length)];
  }

  /**
   * Verify if puzzle solution is correct
   */
  verifyMove(puzzle: Puzzle, moves: string[]): boolean {
    const chess = new Chess();
    chess.load(puzzle.fen);

    for (let i = 0; i < moves.length; i++) {
      const moveStr = moves[i];
      const move = chess.move(moveStr);

      if (!move) {
        return false;
      }

      // Check if this move matches solution
      if (i < puzzle.solution.length) {
        if (`${move.from}${move.to}` !== puzzle.solution[i]) {
          return false;
        }
      }
    }

    return moves.length >= puzzle.solution.length;
  }

  /**
   * Record puzzle attempt
   */
  recordAttempt(puzzle: Puzzle, solved: boolean): void {
    this.stats.attempts++;

    if (solved) {
      this.stats.solved++;
      this.stats.streak++;

      // Update rating based on difficulty
      const ratingGain = Math.max(1, 32 - (this.stats.rating - puzzle.rating) / 150);
      this.stats.rating = Math.min(
        3000,
        Math.round(this.stats.rating + ratingGain)
      );
    } else {
      this.stats.streak = 0;

      // Rating loss on failure
      const ratingLoss = Math.max(1, 16 - (puzzle.rating - this.stats.rating) / 150);
      this.stats.rating = Math.max(
        400,
        Math.round(this.stats.rating - ratingLoss)
      );
    }

    this.saveStats();
  }

  /**
   * Get current stats
   */
  getStats(): PuzzleStats {
    return { ...this.stats };
  }

  /**
   * Save stats to local storage
   */
  private saveStats(): void {
    localStorage.setItem('puzzleStats', JSON.stringify(this.stats));
  }

  /**
   * Load stats from local storage
   */
  loadStats(): void {
    const saved = localStorage.getItem('puzzleStats');
    if (saved) {
      this.stats = JSON.parse(saved);
    }
  }

  /**
   * Generate puzzle from position
   */
  async generateFromPosition(fen: string): Promise<Puzzle | null> {
    const chess = new Chess();
    try {
      chess.load(fen);
    } catch (e) {
      return null;
    }

    // Analyze position to find tactical solutions
    const evaluation = await this.engine.analyze(fen, 20);

    if (evaluation.score.type === 'mate' && evaluation.score.value > 0) {
      return {
        id: `generated_${Date.now()}`,
        fen,
        solution: evaluation.pv.slice(0, 3),
        theme: 'mate',
        difficulty: 1000 + evaluation.score.value * 100,
        rating: 1500,
        source: 'generated'
      };
    }

    return null;
  }
}