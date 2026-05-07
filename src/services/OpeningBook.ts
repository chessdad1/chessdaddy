import axios from 'axios';

export interface OpeningStats {
  totalGames: number;
  whiteWins: number;
  draws: number;
  blackWins: number;
  whiteScore: number; // %
  drawScore: number; // %
  blackScore: number; // %
}

export interface OpeningMove {
  move: string;
  stats: OpeningStats;
  popularity: number; // %
}

export class OpeningBook {
  private readonly lichessApiUrl = 'https://explorer.lichess.ovh/master';
  private cache: Map<string, OpeningMove[]> = new Map();

  /**
   * Get opening statistics for a position
   */
  async getOpeningStats(fen: string): Promise<OpeningMove[]> {
    // Check cache first
    if (this.cache.has(fen)) {
      return this.cache.get(fen) || [];
    }

    try {
      const response = await axios.get(this.lichessApiUrl, {
        params: { fen }
      });

      const moves: OpeningMove[] = (response.data.moves || []).map(
        (move: any) => ({
          move: move.uci,
          stats: {
            totalGames: move.white + move.draws + move.black,
            whiteWins: move.white,
            draws: move.draws,
            blackWins: move.black,
            whiteScore: move.white / (move.white + move.draws + move.black),
            drawScore: move.draws / (move.white + move.draws + move.black),
            blackScore: move.black / (move.white + move.draws + move.black)
          },
          popularity:
            move.white + move.draws + move.black / response.data.topGames
        })
      );

      this.cache.set(fen, moves);
      return moves;
    } catch (error) {
      console.error('Failed to fetch opening stats:', error);
      return [];
    }
  }

  /**
   * Get most popular move for position
   */
  async getPopularMove(fen: string): Promise<string | null> {
    const moves = await this.getOpeningStats(fen);
    if (moves.length === 0) return null;

    return moves.reduce((best, current) =>
      current.popularity > best.popularity ? current : best
    ).move;
  }

  /**
   * Get opening name for position (if known)
   */
  async getOpeningName(fen: string): Promise<string | null> {
    try {
      // This would require a separate opening names database
      // For now, return null
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
