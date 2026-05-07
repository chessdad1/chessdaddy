import { Chess } from 'chess.js';

export interface ParsedGame {
  headers: { [key: string]: string };
  moves: string[];
  result: string;
  moveTexts: string[];
}

export class PGNParser {
  /**
   * Parse PGN string into structured game data
   */
  static parseGame(pgn: string): ParsedGame {
    const lines = pgn.split('\n');
    const headers: { [key: string]: string } = {};
    let movesStartIndex = 0;

    // Parse headers
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('[')) {
        const match = line.match(/\[(\w+)\s+"(.*)"\]/);
        if (match) {
          headers[match[1]] = match[2];
        }
      } else if (line && !line.startsWith('[')) {
        movesStartIndex = i;
        break;
      }
    }

    // Parse moves
    const movesText = lines.slice(movesStartIndex).join(' ');
    const moves = this.extractMoves(movesText);
    const result = headers['Result'] || '*';

    return {
      headers,
      moves,
      result,
      moveTexts: moves
    };
  }

  /**
   * Extract individual moves from PGN text
   */
  private static extractMoves(text: string): string[] {
    const moves: string[] = [];
    const chess = new Chess();

    // Remove comments and variations
    let cleaned = text
      .replace(/\{[^}]*\}/g, '') // Remove comments
      .replace(/\([^)]*\)/g, '') // Remove variations
      .replace(/\d+\./g, '') // Remove move numbers
      .trim();

    // Split by whitespace
    const tokens = cleaned.split(/\s+/);

    for (const token of tokens) {
      if (!token) continue;

      // Skip result indicators
      if (['1-0', '0-1', '1/2-1/2', '*'].includes(token)) {
        continue;
      }

      try {
        const move = chess.move(token, { sloppy: true });
        if (move) {
          moves.push(`${move.from}${move.to}`);
        }
      } catch (e) {
        // Skip invalid moves
      }
    }

    return moves;
  }

  /**
   * Convert UCI notation to algebraic notation
   */
  static toAlgebraic(from: string, to: string, chess: Chess): string {
    try {
      const move = chess.move({ from, to, promotion: 'q' }, { sloppy: true });
      if (move) {
        return move.san;
      }
    } catch (e) {
      // Fallback
    }
    return `${from}${to}`;
  }

  /**
   * Validate PGN format
   */
  static isValidPGN(pgn: string): boolean {
    try {
      const chess = new Chess();
      const game = this.parseGame(pgn);
      
      for (const move of game.moves) {
        const result = chess.move(move, { sloppy: true });
        if (!result) {
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Generate PGN from game
   */
  static generatePGN(
    moves: string[],
    headers: { [key: string]: string } = {}
  ): string {
    let pgn = '';

    // Add headers
    const defaultHeaders = {
      Event: 'ChessDaddy Game',
      Site: 'Local',
      Date: new Date().toISOString().split('T')[0],
      Round: '1',
      White: 'Player',
      Black: 'Engine',
      Result: '*'
    };

    const allHeaders = { ...defaultHeaders, ...headers };
    for (const [key, value] of Object.entries(allHeaders)) {
      pgn += `[${key} "${value}"]\n`;
    }

    pgn += '\n';

    // Add moves
    const chess = new Chess();
    for (let i = 0; i < moves.length; i++) {
      if (i % 2 === 0) {
        pgn += `${Math.floor(i / 2) + 1}. `;
      }

      const move = chess.move(moves[i], { sloppy: true });
      if (move) {
        pgn += `${move.san} `;
      }
    }

    return pgn;
  }
}
