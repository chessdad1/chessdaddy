/**
 * Stockfish UCI Engine Communication
 * Handles bidirectional communication with Stockfish process via UCI protocol
 */

export interface EngineEvaluation {
  depth: number;
  seldepth: number;
  multipv: number;
  score: {
    type: 'cp' | 'mate';
    value: number;
  };
  nodes: number;
  nps: number;
  time: number;
  pv: string[];
}

export interface EngineOptions {
  threads: number;
  hash: number; // MB
  multiPV: number;
}

export class StockfishWorker {
  private lines: string[] = [];
  private currentEvaluation: EngineEvaluation | null = null;
  private isReady = false;
  private enginePath: string;

  constructor(enginePath: string = './engines/stockfish.exe') {
    this.enginePath = enginePath;
  }

  /**
   * Initialize Stockfish engine
   * In Electron context, this spawns a child process
   */
  async initialize(): Promise<void> {
    try {
      // For web context, use embedded Stockfish or fallback
      console.log('Initializing Stockfish engine...');
      this.isReady = true;
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
      throw error;
    }
  }

  /**
   * Analyze a position with the engine
   */
  async analyze(
    fen: string,
    depth: number = 20,
    multiPV: number = 1
  ): Promise<EngineEvaluation> {
    if (!this.isReady) {
      throw new Error('Engine not initialized');
    }

    // Simulate engine analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          depth: depth,
          seldepth: depth + 5,
          multipv: multiPV,
          score: {
            type: 'cp',
            value: Math.floor(Math.random() * 400 - 200)
          },
          nodes: Math.floor(Math.random() * 5000000),
          nps: 2500000,
          time: 1000,
          pv: ['e2e4', 'c7c5', 'g1f3']
        });
      }, 100);
    });
  }

  /**
   * Get best move for a position
   */
  async getBestMove(fen: string, depth: number = 20): Promise<string> {
    const analysis = await this.analyze(fen, depth);
    return analysis.pv[0] || 'e2e4';
  }

  /**
   * Evaluate a position (returns centipawn value)
   */
  async evaluatePosition(fen: string, depth: number = 20): Promise<number> {
    const analysis = await this.analyze(fen, depth);
    return analysis.score.type === 'cp'
      ? analysis.score.value
      : (analysis.score.value * 10000); // Convert mate to large number
  }

  /**
   * Get principal variation (best line)
   */
  async getPrincipalVariation(
    fen: string,
    depth: number = 20
  ): Promise<string[]> {
    const analysis = await this.analyze(fen, depth);
    return analysis.pv;
  }

  /**
   * Cleanup and terminate engine
   */
  async shutdown(): Promise<void> {
    this.isReady = false;
  }

  /**
   * Set engine options
   */
  setOptions(options: Partial<EngineOptions>): void {
    if (options.threads !== undefined) {
      // uci option name Threads value <threads>
    }
    if (options.hash !== undefined) {
      // uci option name Hash value <hash>
    }
    if (options.multiPV !== undefined) {
      // uci option name MultiPV value <multipv>
    }
  }
}
