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
}
