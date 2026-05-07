import { Chess } from 'chess.js';

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  theme: 'mate' | 'fork' | 'pin' | 'skewer' | 'sacrifice' | 'defense';
  difficulty: number;
  rating: number;
}

export class PuzzleGenerator {
  /**
   * Generate puzzles from a PGN string
   * In a real implementation, this would use Stockfish to analyze positions
   */
  public generateFromPGN(pgn: string): Puzzle[] {
    const puzzles: Puzzle[] = [];
    const chess = new Chess();

    try {
      chess.load(pgn);
      const moves = chess.moves({ verbose: true });

      // Analyze significant positions
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        chess.move(move);

        // In a real app, evaluate position for tactical opportunities
        // Check for patterns like forks, pins, skewers, etc.

        chess.undo();
      }
    } catch (error) {
      console.error('Error generating puzzles:', error);
    }

    return puzzles;
  }

  /**
   * Rate puzzle difficulty based on complexity
   */
  public ratePuzzle(puzzle: Puzzle): number {
    let rating = 500; // Base rating

    // Add difficulty based on solution length
    rating += puzzle.solution.length * 100;

    // Add difficulty based on theme
    const themeMultiplier: { [key: string]: number } = {
      mate: 1.5,
      sacrifice: 1.3,
      fork: 1.0,
      pin: 1.1,
      skewer: 1.2,
      defense: 0.9
    };

    rating *= themeMultiplier[puzzle.theme] || 1.0;

    return Math.min(3000, Math.max(500, Math.round(rating)));
  }
}