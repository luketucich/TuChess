export class Board {
  private board: string[][];

  constructor() {
    this.board = this.initializeBoard();
  }

  private initializeBoard(): string[][] {
    return [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ];
  }

  getBoard(): string[][] {
    return this.board;
  }

  indexToSquare(index: [number, number]): string {
    const [row, col]: [number, number] = index;

    // Convert row number to rank
    const rank: string = `${8 - row}`;

    // Convert column number to file
    const file: string = String.fromCharCode(97 + col);

    return file + rank;
  }

  squareToIndex(square: string): [number, number] {
    // Convert file to column number
    const col: number = square.charCodeAt(0) - "a".charCodeAt(0);

    // Convert rank to row number
    const row: number = 8 - Number(square[1]);

    return [row, col];
  }

  squareIsValid(square: string): boolean {
    if (square.length !== 2) return false;

    const [file, rank]: [string, string] = [square[0], square[1]];

    if (file < "a" || file > "h") return false;
    if (rank < "1" || rank > "8") return false;

    return true;
  }

  indexIsValid(index: [number, number]): boolean {
    const [row, col]: [number, number] = index;

    if (row < 0 || row > 7) return false;
    if (col < 0 || col > 7) return false;

    return true;
  }

  getSquare(square: string): string {
    if (!this.squareIsValid(square)) {
      throw new Error("Invalid square");
    }

    const [row, col]: [number, number] = this.squareToIndex(square);
    return this.board[row][col];
  }

  movePiece(from: string, to: string): void {
    if (!this.squareIsValid(from) || !this.squareIsValid(to)) {
      throw new Error("Invalid square");
    }

    const [fromRow, fromCol]: [number, number] = this.squareToIndex(from);
    const [toRow, toCol]: [number, number] = this.squareToIndex(to);

    if (this.board[fromRow][fromCol] === "") {
      throw new Error("No piece at from square");
    }

    const piece: string = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = "";
    this.board[toRow][toCol] = piece;
  }
}
