import { BoardMove, BoardSquare } from "../Board.ts";

export class HistoryMove {
  private from: BoardSquare;
  private to: BoardSquare;
  private move: BoardMove;

  constructor(from: BoardSquare, to: BoardSquare, move: BoardMove) {
    this.from = from;
    this.to = to;
    this.move = move;
  }

  getFrom(): BoardSquare {
    return this.from;
  }

  getTo(): BoardSquare {
    return this.to;
  }

  getMove(): BoardMove {
    return this.move;
  }
}
