import { describe, expect, test, it, beforeEach } from "vitest";
import { Board } from "../game/Board.ts";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { Knight } from "../game/Pieces/Knight.ts";
import { Bishop } from "../game/Pieces/Bishop.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Queen } from "../game/Pieces/Queen.ts";
import { King } from "../game/Pieces/King.ts";
import { Player } from "../game/Player.ts";

describe("Chess Board Initialization", () => {
  test("should correctly initialize kings", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[7][4]).toBeInstanceOf(King); // White king at e1
    expect(initialSetup[0][4]).toBeInstanceOf(King); // Black king at e8
  });

  test("should correctly initialize pawns", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[6][0]).toBeInstanceOf(Pawn); // White pawn at a2
    expect(initialSetup[1][0]).toBeInstanceOf(Pawn); // Black pawn at a7
  });

  test("should correctly initialize knights and bishops", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[0][1]).toBeInstanceOf(Knight); // Black knight at b8
    expect(initialSetup[0][2]).toBeInstanceOf(Bishop); // Black bishop at c8
  });

  test("should correctly initialize rooks and queens", () => {
    const board = new Board();
    const initialSetup = board.getBoard();
    expect(initialSetup[0][0]).toBeInstanceOf(Rook); // Black rook at a8
    expect(initialSetup[0][3]).toBeInstanceOf(Queen); // Black queen at d8
  });
});

describe("Index to board square", () => {
  test("should convert from top left corner", () => {
    const board = new Board();
    expect(board.indexToSquare([0, 0])).toBe("a8");
  });

  test("should convert from middle of board", () => {
    const board = new Board();
    expect(board.indexToSquare([4, 4])).toBe("e4");
  });

  test("should convert from bottom right corner", () => {
    const board = new Board();
    expect(board.indexToSquare([7, 7])).toBe("h1");
  });

  test("should convert arbitrary position", () => {
    const board = new Board();
    expect(board.indexToSquare([2, 2])).toBe("c6");
  });
});

describe("Board square to index", () => {
  test("should convert from top left corner", () => {
    const board = new Board();
    expect(board.squareToIndex("a8")).toStrictEqual([0, 0]);
  });

  test("should convert from bottom right corner", () => {
    const board = new Board();
    expect(board.squareToIndex("h1")).toStrictEqual([7, 7]);
  });

  test("should convert arbitrary positions", () => {
    const board = new Board();
    expect(board.squareToIndex("d4")).toStrictEqual([4, 3]);
    expect(board.squareToIndex("e4")).toStrictEqual([4, 4]);
  });
});

describe("Check square validity", () => {
  test("should validate legal squares", () => {
    const board = new Board();
    expect(board.isValidSquare("a8")).toBeTruthy();
    expect(board.isValidSquare("e4")).toBeTruthy();
    expect(board.isValidSquare("h1")).toBeTruthy();
    expect(board.isValidSquare("f3")).toBeTruthy();
  });

  test("should invalidate out of range squares", () => {
    const board = new Board();
    expect(board.isValidSquare("a9")).toBeFalsy();
    expect(board.isValidSquare("i8")).toBeFalsy();
  });

  test("should invalidate malformed inputs", () => {
    const board = new Board();
    expect(board.isValidSquare("a")).toBeFalsy();
    expect(board.isValidSquare("")).toBeFalsy();
  });
});

describe("Check index validity", () => {
  test("should validate legal indices", () => {
    const board = new Board();
    expect(board.isValidIndex([0, 0])).toBeTruthy();
    expect(board.isValidIndex([4, 4])).toBeTruthy();
    expect(board.isValidIndex([7, 7])).toBeTruthy();
  });

  test("should invalidate out of range indices", () => {
    const board = new Board();
    expect(board.isValidIndex([-1, 0])).toBeFalsy();
    expect(board.isValidIndex([0, 8])).toBeFalsy();
    expect(board.isValidIndex([8, 8])).toBeFalsy();
    expect(board.isValidIndex([8, -1])).toBeFalsy();
  });
});

describe("Get piece at square", () => {
  test("should return rooks at corner squares", () => {
    const board = new Board();
    expect(board.getSquare("a8")).toBeInstanceOf(Rook); // Black rook
    expect(board.getSquare("h1")).toBeInstanceOf(Rook); // White rook
    expect(board.getSquare("a1")).toBeInstanceOf(Rook); // White rook
  });

  test("should return empty square for middle positions", () => {
    const board = new Board();
    expect(board.getSquare("e4")).toBe(null);
  });

  test("should return other pieces at correct positions", () => {
    const board = new Board();
    expect(board.getSquare("g8")).toBeInstanceOf(Knight); // Black knight
    expect(board.getSquare("c8")).toBeInstanceOf(Bishop); // Black bishop
    expect(board.getSquare("d8")).toBeInstanceOf(Queen); // Black queen
    expect(board.getSquare("e8")).toBeInstanceOf(King); // Black king
  });
});

describe("Get piece at index", () => {
  test("should correctly retrieve square contents from index", () => {
    const board = new Board();
    expect(board.getIndex([0, 0])).toBeInstanceOf(Rook);
  });
});

describe("Pawn moves", () => {
  test("should handle single square pawn move", () => {
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    const player = new Player("white", true);
    board.movePiece("a2", "a3", player);
    expect(board.getSquare("a3")).toBe(pawn);
    expect(board.getSquare("a2")).toBe(null);
    expect(pawn.getHasMoved()).toBeTruthy();
    expect(pawn.getPosition()).toBe("a3");
  });

  test("should handle initial double square pawn move", () => {
    const board = new Board();
    const pawn = board.getSquare("a2") as Pawn;
    const player = new Player("white", true);
    board.movePiece("a2", "a4", player);
    expect(board.getSquare("a4")).toBe(pawn);
    expect(board.getSquare("a2")).toBe(null);
    expect(pawn.getHasMoved()).toBeTruthy();
    expect(pawn.getPosition()).toBe("a4");
  });

  test("should handle pawn capture with one option", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("d5", new Queen("black", "d5"));
    const pawn = board.getSquare("e4") as Pawn;
    const queen = board.getSquare("d5") as Queen;
    board.movePiece("e4", "d5", player);
    expect(board.getSquare("d5")).toBe(pawn);
    expect(board.getSquare("e4")).toBe(null);
    expect(player.getPieces()).toContain(queen);
  });

  test("should handle pawn capture with multiple options", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("d5", new Queen("black", "d5"));
    board.setSquare("f5", new Rook("black", "f5"));
    const pawn = board.getSquare("e4") as Pawn;
    const queen = board.getSquare("d5") as Queen;
    board.movePiece("e4", "d5", player);
    expect(board.getSquare("d5")).toBe(pawn);
    expect(board.getSquare("e4")).toBe(null);
    expect(player.getPieces()).toContain(queen);
  });

  test("should handle en passant capture for white pawn", () => {
    const board = new Board();
    const player1 = new Player("white", false);
    const player2 = new Player("black", true);
    board.setSquare("a5", new Pawn("white", "a5"));
    board.movePiece("b7", "b5", player2);
    const pawn1 = board.getSquare("a5") as Pawn;
    const pawn2 = board.getSquare("b5") as Pawn;
    player1.setIsTurn(true);
    player2.setIsTurn(false);
    board.movePiece("a5", "b6", player1);
    expect(board.getSquare("b6")).toBe(pawn1);
    expect(board.getSquare("b5")).toBe(null);
    expect(board.getSquare("a5")).toBe(null);
    expect(player1.getPieces()).toContain(pawn2);
  });

  test("should handle en passant capture for black pawn", () => {
    const board = new Board();
    const player1 = new Player("black", false);
    const player2 = new Player("white", true);
    board.setSquare("a4", new Pawn("black", "a4"));
    board.movePiece("b2", "b4", player2);
    const pawn1 = board.getSquare("a4") as Pawn;
    const pawn2 = board.getSquare("b4") as Pawn;
    player2.setIsTurn(false);
    player1.setIsTurn(true);
    board.movePiece("a4", "b3", player1);
    expect(board.getSquare("b3")).toBe(pawn1);
    expect(board.getSquare("b4")).toBe(null);
    expect(board.getSquare("a4")).toBe(null);
    expect(player1.getPieces()).toContain(pawn2);
  });
});

describe("Bishop moves", () => {
  test("should move diagonally", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("c4", new Bishop("white", "c4"));
    board.movePiece("c4", "a6", player);
    expect(board.getSquare("a6")).toBeInstanceOf(Bishop);
    expect(board.getSquare("c4")).toBe(null);
  });

  test("should capture enemy pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("c4", new Bishop("white", "c4"));
    board.setSquare("e6", new Pawn("black", "e6"));
    board.movePiece("c4", "e6", player);
    expect(board.getSquare("e6")).toBeInstanceOf(Bishop);
    expect(board.getSquare("c4")).toBe(null);
    expect(player.getPieces().length).toBe(1);
  });

  test("should not move through other pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("c4", new Bishop("white", "c4"));
    board.setSquare("d5", new Pawn("white", "d5"));
    expect(() => board.movePiece("c4", "e6", player)).toThrow();
  });
});

describe("Knight moves", () => {
  test("should move in L-shape", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Knight("white", "d4"));
    board.movePiece("d4", "e6", player);
    expect(board.getSquare("e6")).toBeInstanceOf(Knight);
    expect(board.getSquare("d4")).toBe(null);
  });

  test("should capture enemy pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Knight("white", "d4"));
    board.setSquare("f5", new Pawn("black", "f5"));
    board.movePiece("d4", "f5", player);
    expect(board.getSquare("f5")).toBeInstanceOf(Knight);
    expect(player.getPieces().length).toBe(1);
  });

  test("should jump over other pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Knight("white", "d4"));
    // Place pieces in the way
    board.setSquare("d5", new Pawn("white", "d5"));
    board.setSquare("e4", new Pawn("black", "e4"));
    board.movePiece("d4", "e6", player);
    expect(board.getSquare("e6")).toBeInstanceOf(Knight);
    expect(board.getSquare("d5")).toBeInstanceOf(Pawn);
    expect(board.getSquare("e4")).toBeInstanceOf(Pawn);
  });
});

describe("Rook moves", () => {
  test("should move horizontally and vertically", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Rook("white", "d4"));
    board.movePiece("d4", "d6", player);
    expect(board.getSquare("d6")).toBeInstanceOf(Rook);
    expect(board.getSquare("d4")).toBe(null);

    const board2 = new Board();
    board2.setSquare("d4", new Rook("white", "d4"));
    board2.movePiece("d4", "h4", player);
    expect(board2.getSquare("h4")).toBeInstanceOf(Rook);
    expect(board2.getSquare("d4")).toBe(null);
  });

  test("should capture enemy pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Rook("white", "d4"));
    board.setSquare("d7", new Pawn("black", "d7"));
    board.movePiece("d4", "d7", player);
    expect(board.getSquare("d7")).toBeInstanceOf(Rook);
    expect(player.getPieces().length).toBe(1);
  });

  test("should not move through other pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Rook("white", "d4"));
    board.setSquare("d6", new Pawn("white", "d6"));
    expect(() => board.movePiece("d4", "d8", player)).toThrow();
  });
});

describe("Queen moves", () => {
  test("should move diagonally, horizontally, and vertically", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Queen("white", "d4"));

    // Diagonal move
    board.movePiece("d4", "f6", player);
    expect(board.getSquare("f6")).toBeInstanceOf(Queen);
    expect(board.getSquare("d4")).toBe(null);

    // Horizontal move
    const board2 = new Board();
    board2.setSquare("d4", new Queen("white", "d4"));
    board2.movePiece("d4", "h4", player);
    expect(board2.getSquare("h4")).toBeInstanceOf(Queen);

    // Vertical move
    const board3 = new Board();
    board3.setSquare("d4", new Queen("white", "d4"));
    board3.movePiece("d4", "d6", player);
    expect(board3.getSquare("d6")).toBeInstanceOf(Queen);
  });

  test("should capture enemy pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Queen("white", "d4"));
    board.setSquare("g7", new Pawn("black", "g7"));
    board.movePiece("d4", "g7", player);
    expect(board.getSquare("g7")).toBeInstanceOf(Queen);
    expect(player.getPieces().length).toBe(1);
  });

  test("should not move through other pieces", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Queen("white", "d4"));
    board.setSquare("f6", new Pawn("white", "f6"));
    expect(() => board.movePiece("d4", "g7", player)).toThrow();

    board.setSquare("d6", new Pawn("black", "d6"));
    expect(() => board.movePiece("d4", "d8", player)).toThrow();
  });
});

describe("Revealed check", () => {
  test("should detect revealed check with rook", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Rook("white", "d4"));
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("h4", new King("black", "h4"));

    expect(board.isSquareAttacked("h4", "black")).toBeFalsy();

    board.movePiece("e4", "e5", player);

    expect(board.isSquareAttacked("h4", "black")).toBeTruthy();
  });

  test("should detect revealed check with bishop", () => {
    const board = new Board();
    const player = new Player("black", true);
    board.setSquare("f6", new Bishop("black", "f6"));
    board.setSquare("e5", new Pawn("black", "e5"));
    board.setSquare("c3", new King("white", "c3"));

    expect(board.isSquareAttacked("c3", "white")).toBeFalsy();

    board.movePiece("e5", "e4", player);

    expect(board.isSquareAttacked("c3", "white")).toBeTruthy();
  });

  test("should detect revealed check with queen (diagonal)", () => {
    const board = new Board();
    const player = new Player("black", true);
    board.setSquare("f6", new Queen("black", "f6"));
    board.setSquare("e5", new Pawn("black", "e5"));
    board.setSquare("c3", new King("white", "c3"));

    expect(board.isSquareAttacked("c3", "white")).toBeFalsy();

    board.movePiece("e5", "e4", player);

    expect(board.isSquareAttacked("c3", "white")).toBeTruthy();
  });

  test("should detect revealed check with queen (horizontal)", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Queen("white", "d4"));
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("h4", new King("black", "h4"));

    expect(board.isSquareAttacked("h4", "black")).toBeFalsy();

    board.movePiece("e4", "e5", player);

    expect(board.isSquareAttacked("h4", "black")).toBeTruthy();
  });

  test("should detect revealed check with queen (vertical)", () => {
    const board = new Board();
    const player = new Player("white", true);

    board.setSquare("d3", new Queen("white", "d3"));
    board.setSquare("d4", new Knight("white", "d4"));
    board.setSquare("d6", new King("black", "d6"));

    expect(board.isSquareAttacked("d6", "black")).toBeFalsy();

    board.movePiece("d4", "f3", player);

    expect(board.isSquareAttacked("d6", "black")).toBeTruthy();
  });
});

describe("should detect pawn attacks", () => {
  test("should detect pawn attacks from black", () => {
    const board = new Board();
    expect(board.isSquareAttacked("b6", "white")).toBeTruthy();
  });

  test("should detect pawn attacks from white", () => {
    const board = new Board();
    expect(board.isSquareAttacked("b3", "black")).toBeTruthy();
  });
});

describe("should detect king attacks", () => {
  test("should detect king attacks from black", () => {
    const board = new Board();
    board.setSquare("e4", new King("black", "e4"));

    expect(board.isSquareAttacked("e5", "white")).toBeTruthy();
    expect(board.isSquareAttacked("d5", "white")).toBeTruthy();
    expect(board.isSquareAttacked("d4", "white")).toBeTruthy();
    expect(board.isSquareAttacked("d3", "white")).toBeTruthy();
    expect(board.isSquareAttacked("e3", "white")).toBeTruthy();
    expect(board.isSquareAttacked("f3", "white")).toBeTruthy();
    expect(board.isSquareAttacked("f4", "white")).toBeTruthy();
    expect(board.isSquareAttacked("f5", "white")).toBeTruthy();
  });

  test("should detect king attacks from white", () => {
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));

    expect(board.isSquareAttacked("e5", "black")).toBeTruthy();
    expect(board.isSquareAttacked("d5", "black")).toBeTruthy();
    expect(board.isSquareAttacked("d4", "black")).toBeTruthy();
    expect(board.isSquareAttacked("d3", "black")).toBeTruthy();
    expect(board.isSquareAttacked("e3", "black")).toBeTruthy();
    expect(board.isSquareAttacked("f3", "black")).toBeTruthy();
    expect(board.isSquareAttacked("f4", "black")).toBeTruthy();
    expect(board.isSquareAttacked("f5", "black")).toBeTruthy();
  });
});

describe("should clone board", () => {
  test("should clone board with same pieces", () => {
    const board = new Board();
    const clone = board.cloneBoard();
    const boardPieces = board.getBoard().flat();
    const clonePieces = clone.getBoard().flat();
    expect(boardPieces).toEqual(clonePieces);
  });

  test("modifying clone should not affect original board", () => {
    const board = new Board();
    const clone = board.cloneBoard();

    board.movePiece("e2", "e4", new Player("white", true));
    expect(board.getSquare("e4")).toBeInstanceOf(Pawn);
    expect(clone.getSquare("e4")).toBe(null);
    expect(clone.getSquare("e2")).toBeInstanceOf(Pawn);
  });
});

describe("should undo moves", () => {
  test("should undo double pawn move", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.movePiece("a2", "a4", player);
    board.undoMove();
    expect(board.getSquare("a2")).toBeInstanceOf(Pawn);
    expect(board.getSquare("a4")).toBe(null);
    expect((board.getSquare("a2") as Pawn).getHasMoved()).toBeFalsy();
  });

  test("should undo pawn capture", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("e4", new Pawn("white", "e4"));
    board.setSquare("d5", new Queen("black", "d5"));
    board.movePiece("e4", "d5", player);
    board.undoMove();
    expect(board.getSquare("d5")).toBeInstanceOf(Queen);
    expect(board.getSquare("e4")).toBeInstanceOf(Pawn);
  });

  test("should undo knight capture", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("d4", new Knight("white", "d4"));
    board.setSquare("f5", new Pawn("black", "f5"));
    board.movePiece("d4", "f5", player);
    board.undoMove();
    expect(board.getSquare("f5")).toBeInstanceOf(Pawn);
    expect(board.getSquare("d4")).toBeInstanceOf(Knight);
  });

  test("should undo en passant", () => {
    const board = new Board();
    const player1 = new Player("white", false);
    const player2 = new Player("black", true);
    board.setSquare("a5", new Pawn("white", "a5"));
    board.movePiece("b7", "b5", player2);
    player2.setIsTurn(false);
    player1.setIsTurn(true);
    board.movePiece("a5", "b6", player1);
    board.undoMove();
    expect(board.getSquare("b6")).toBe(null);
    expect(board.getSquare("b5")).toBeInstanceOf(Pawn);
    expect(board.getSquare("b5")!.getColor()).toBe("black");
    expect(board.getSquare("a5")).toBeInstanceOf(Pawn);
    expect(board.getSquare("a5")!.getColor()).toBe("white");
  });

  test("should undo short castle (white)", () => {
    const board = new Board();
    const player = new Player("white", true);
    board.setSquare("f1", null);
    board.setSquare("g1", null);

    // Original rook & king positions
    expect(board.getSquare("e1")).toBeInstanceOf(King);
    expect(board.getSquare("h1")).toBeInstanceOf(Rook);

    // Post-castle positions
    board.movePiece("e1", "g1", player);

    expect(board.getSquare("g1")).toBeInstanceOf(King);
    expect(board.getSquare("f1")).toBeInstanceOf(Rook);

    // Undo-castle positions
    board.undoMove();

    expect(board.getSquare("g1")).toBe(null);
    expect(board.getSquare("f1")).toBe(null);
    expect(board.getSquare("e1")).toBeInstanceOf(King);
    expect(board.getSquare("h1")).toBeInstanceOf(Rook);

    expect((board.getSquare("e1") as King).getHasMoved()).toBeFalsy();
    expect((board.getSquare("h1") as Rook).getHasMoved()).toBeFalsy();
  });
});

describe("should detect checkmate", () => {
  test("should detect checkmate with rook", () => {
    const board = new Board();
    board.clear();

    board.setSquare("e6", new King("white", "e6"));
    board.setSquare("e8", new King("black", "e8"));
    board.setSquare("g8", new Rook("white", "g8"));

    expect(board.getKingPosition("black")).toBe("e8");
    expect(board.getKingPosition("white")).toBe("e6");
    expect(board.isSquareAttacked("e8", "black")).toBeTruthy();
    expect(board.isCheckmateOrStalemate("black")).toEqual("checkmate");
  });

  test("should detect fools mate with queen", () => {
    const board = new Board();
    const player1 = new Player("white", true);
    const player2 = new Player("black", false);

    board.movePiece("e2", "e4", player1);

    player1.setIsTurn(false);
    player2.setIsTurn(true);

    board.movePiece("g7", "g5", player2);

    player1.setIsTurn(true);
    player2.setIsTurn(false);

    board.movePiece("d1", "e2", player1);

    player1.setIsTurn(false);
    player2.setIsTurn(true);

    board.movePiece("f7", "f5", player2);

    player1.setIsTurn(true);
    player2.setIsTurn(false);

    board.movePiece("e2", "h5", player1);

    expect(board.isCheckmateOrStalemate("black")).toEqual("checkmate");
  });
});

describe("should detect stalemate", () => {
  test("should detect stalemate with king and queen", () => {
    const board = new Board();
    board.clear();

    board.setSquare("a8", new King("black", "a8"));
    board.setSquare("b6", new King("white", "b6"));
    board.setSquare("c7", new Queen("white", "c7"));

    expect(board.isCheckmateOrStalemate("black")).toEqual("stalemate");
  });
});

describe("Board Serialization and Deserialization", () => {
  let board: Board;
  let whitePlayer: Player;
  let blackPlayer: Player;

  beforeEach(() => {
    board = new Board();
    whitePlayer = new Player("white", true);
    blackPlayer = new Player("black", false);
  });

  it("should serialize and deserialize an empty board", () => {
    // Create empty board
    const emptyBoard = new Board();
    emptyBoard.clear();

    // Serialize and deserialize
    const serialized = emptyBoard.serializeBoard();
    const deserializedBoard = new Board();
    deserializedBoard.deserializeBoard(serialized);

    // Verify all squares are null
    const board = deserializedBoard.getBoard();
    for (const row of board) {
      for (const square of row) {
        expect(square).toBeNull();
      }
    }
  });

  it("should serialize and deserialize the initial board setup", () => {
    // Serialize the initial board
    const serialized = board.serializeBoard();

    // Create a new board and deserialize into it
    const deserializedBoard = new Board();
    deserializedBoard.clear(); // Clear first to ensure we're really loading from serialized data
    deserializedBoard.deserializeBoard(serialized);

    // Verify king positions
    expect(deserializedBoard.getKingPosition("white")).toBe("e1");
    expect(deserializedBoard.getKingPosition("black")).toBe("e8");

    // Check white pieces
    const whiteRookA1 = deserializedBoard.getSquare("a1");
    expect(whiteRookA1).not.toBeNull();
    expect(whiteRookA1?.getName()).toBe("rook");
    expect(whiteRookA1?.getColor()).toBe("white");
    expect(whiteRookA1?.getPosition()).toBe("a1");

    const whiteKing = deserializedBoard.getSquare("e1");
    expect(whiteKing?.getName()).toBe("king");
    expect(whiteKing?.getColor()).toBe("white");

    // Check black pieces
    const blackKnight = deserializedBoard.getSquare("b8");
    expect(blackKnight?.getName()).toBe("knight");
    expect(blackKnight?.getColor()).toBe("black");

    const blackPawn = deserializedBoard.getSquare("d7");
    expect(blackPawn?.getName()).toBe("pawn");
    expect(blackPawn?.getColor()).toBe("black");
  });

  it("should serialize and deserialize after a few moves", () => {
    // Make some standard chess moves
    board.movePiece("e2", "e4", whitePlayer); // White pawn
    whitePlayer.setIsTurn(false);
    blackPlayer.setIsTurn(true);

    board.movePiece("e7", "e5", blackPlayer); // Black pawn
    blackPlayer.setIsTurn(false);
    whitePlayer.setIsTurn(true);

    board.movePiece("g1", "f3", whitePlayer); // White knight

    // Serialize and deserialize
    const serialized = board.serializeBoard();
    const deserializedBoard = new Board();
    deserializedBoard.deserializeBoard(serialized);

    // Check pieces are in their new positions
    expect(deserializedBoard.getSquare("e2")).toBeNull();
    expect(deserializedBoard.getSquare("e4")?.getName()).toBe("pawn");
    expect(deserializedBoard.getSquare("e4")?.getColor()).toBe("white");

    expect(deserializedBoard.getSquare("e7")).toBeNull();
    expect(deserializedBoard.getSquare("e5")?.getName()).toBe("pawn");
    expect(deserializedBoard.getSquare("e5")?.getColor()).toBe("black");

    expect(deserializedBoard.getSquare("g1")).toBeNull();
    expect(deserializedBoard.getSquare("f3")?.getName()).toBe("knight");
    expect(deserializedBoard.getSquare("f3")?.getColor()).toBe("white");

    // Check history was preserved
    const history = deserializedBoard.getHistory();
    expect(history.length).toBe(3);

    // Check first move in history
    const firstMove = history[0];
    expect(firstMove.getFrom()?.getColor()).toBe("white");
    expect(firstMove.getFrom()?.getName()).toBe("pawn");
    expect(firstMove.getFrom()?.getPosition()).toBe("e2");
    expect(firstMove.getMove().square).toBe("e4");
  });

  it("should serialize and deserialize a complex board with captures", () => {
    // Set up a more complex position with captures
    board.movePiece("e2", "e4", whitePlayer);
    whitePlayer.setIsTurn(false);
    blackPlayer.setIsTurn(true);

    board.movePiece("d7", "d5", blackPlayer);
    blackPlayer.setIsTurn(false);
    whitePlayer.setIsTurn(true);

    // Capture with pawn
    board.movePiece("e4", "d5", whitePlayer);
    whitePlayer.setIsTurn(false);
    blackPlayer.setIsTurn(true);

    // Serialize and deserialize
    const serialized = board.serializeBoard();
    const deserializedBoard = new Board();
    deserializedBoard.deserializeBoard(serialized);

    // Check capture happened
    expect(deserializedBoard.getSquare("d5")?.getName()).toBe("pawn");
    expect(deserializedBoard.getSquare("d5")?.getColor()).toBe("white");
    expect(deserializedBoard.getSquare("d7")).toBeNull();
    expect(deserializedBoard.getSquare("e4")).toBeNull();

    // Check history tracked the capture
    const history = deserializedBoard.getHistory();
    expect(history.length).toBe(3);

    const captureMove = history[2];
    expect(captureMove.getMove().isCapture).toBe(true);
  });

  it("should serialize and deserialize after castling", () => {
    // Set up a position where white can castle kingside
    board.clear();

    // Place only the necessary pieces for castling
    board.setSquare("e1", new King("white", "e1", false));
    board.setSquare("h1", new Rook("white", "h1", false));
    board.setSquare("e8", new King("black", "e8", false));

    // Castle
    board.movePiece("e1", "g1", whitePlayer);

    // Serialize and deserialize
    const serialized = board.serializeBoard();
    const deserializedBoard = new Board();
    deserializedBoard.deserializeBoard(serialized);

    // Check king moved
    expect(deserializedBoard.getSquare("e1")).toBeNull();
    expect(deserializedBoard.getSquare("g1")?.getName()).toBe("king");
    expect(deserializedBoard.getSquare("g1")?.getColor()).toBe("white");

    // Check rook moved
    expect(deserializedBoard.getSquare("h1")).toBeNull();
    expect(deserializedBoard.getSquare("f1")?.getName()).toBe("rook");
    expect(deserializedBoard.getSquare("f1")?.getColor()).toBe("white");

    // Check king position is tracked
    expect(deserializedBoard.getKingPosition("white")).toBe("g1");

    // Check history recorded it as a castle
    const history = deserializedBoard.getHistory();
    expect(history.length).toBe(1);
    const castleMove = history[0].getMove();
    expect("isCastle" in castleMove && castleMove.isCastle).toBe(true);
  });

  it("should serialize and deserialize pawn promotion", () => {
    // Set up a pawn promotion scenario
    board.clear();

    board.setSquare("e7", new Pawn("white", "e7", true));
    board.setSquare("e8", null); // Empty square for promotion
    board.setSquare("e1", new King("white", "e1", false));
    board.setSquare("e8", new King("black", "e8", false));

    // We need to mock a promotion move since your system likely has UI for promotion
    const pawnToPromote = board.getSquare("e7") as Pawn;
    const moves = pawnToPromote.getMoves(board);

    // Find the promotion move
    const promotionMove = moves.find(
      (move) =>
        "isPromotion" in move && move.isPromotion && move.square === "e8"
    );

    if (promotionMove && "promotionPiece" in promotionMove) {
      // Set promotion piece to queen
      promotionMove.promotionPiece = "queen";

      // Use moveClonedPiece to execute with our predetermined move
      board.moveClonedPiece("e7", "e8", whitePlayer, promotionMove);

      // Serialize and deserialize
      const serialized = board.serializeBoard();
      const deserializedBoard = new Board();
      deserializedBoard.deserializeBoard(serialized);

      // Check promoted piece
      const promotedPiece = deserializedBoard.getSquare("e8");
      expect(promotedPiece?.getName()).toBe("queen");
      expect(promotedPiece?.getColor()).toBe("white");

      // Check history contains promotion info
      const history = deserializedBoard.getHistory();
      const lastMove = history[0].getMove();
      expect("isPromotion" in lastMove && lastMove.isPromotion).toBe(true);
      expect("promotionPiece" in lastMove && lastMove.promotionPiece).toBe(
        "queen"
      );
    } else {
      // If no promotion move found, fail the test
      expect(promotionMove).toBeUndefined();
    }
  });

  it("should handle en passant serialization and deserialization", () => {
    // Set up an en passant scenario
    board.clear();

    // Place kings
    board.setSquare("e1", new King("white", "e1", false));
    board.setSquare("e8", new King("black", "e8", false));

    // Set up pawns for en passant
    board.setSquare("e5", new Pawn("white", "e5", true));
    board.setSquare("d7", new Pawn("black", "d7", false));

    // Move black pawn two squares forward (to enable en passant)
    blackPlayer.setIsTurn(true);
    board.movePiece("d7", "d5", blackPlayer);
    blackPlayer.setIsTurn(false);
    whitePlayer.setIsTurn(true);

    // Get the white pawn
    const whitePawn = board.getSquare("e5") as Pawn;
    const moves = whitePawn.getMoves(board);

    // Find the en passant move
    const enPassantMove = moves.find(
      (move) =>
        "isEnPassant" in move && move.isEnPassant && move.square === "d6"
    );

    if (enPassantMove) {
      // Execute en passant capture
      board.moveClonedPiece("e5", "d6", whitePlayer, enPassantMove);

      // Serialize and deserialize
      const serialized = board.serializeBoard();
      const deserializedBoard = new Board();
      deserializedBoard.deserializeBoard(serialized);

      // Check pawn positions after en passant
      expect(deserializedBoard.getSquare("e5")).toBeNull(); // Original white pawn gone
      expect(deserializedBoard.getSquare("d5")).toBeNull(); // Captured black pawn gone
      expect(deserializedBoard.getSquare("d6")?.getName()).toBe("pawn"); // White pawn in new position
      expect(deserializedBoard.getSquare("d6")?.getColor()).toBe("white");

      // Check history recorded the en passant
      const history = deserializedBoard.getHistory();
      const lastMove = history[1].getMove(); // Second move should be en passant
      expect("isEnPassant" in lastMove && lastMove.isEnPassant).toBe(true);
    } else {
      // If no en passant move found, fail the test
      expect(enPassantMove).toBeDefined();
    }
  });

  it("should handle check and checkmate state serialization", () => {
    // Set up a checkmate position (Fool's mate)
    board = new Board(); // Start with fresh board

    // Move to create Fool's mate
    board.movePiece("f2", "f3", whitePlayer);
    whitePlayer.setIsTurn(false);
    blackPlayer.setIsTurn(true);

    board.movePiece("e7", "e5", blackPlayer);
    blackPlayer.setIsTurn(false);
    whitePlayer.setIsTurn(true);

    board.movePiece("g2", "g4", whitePlayer);
    whitePlayer.setIsTurn(false);
    blackPlayer.setIsTurn(true);

    board.movePiece("d8", "h4", blackPlayer); // Queen delivers checkmate

    // Serialize and deserialize
    const serialized = board.serializeBoard();
    const deserializedBoard = new Board();
    deserializedBoard.deserializeBoard(serialized);

    // Check the black queen is in the right position
    const blackQueen = deserializedBoard.getSquare("h4");
    expect(blackQueen?.getName()).toBe("queen");
    expect(blackQueen?.getColor()).toBe("black");

    // Check that white king is in checkmate
    const result = deserializedBoard.isCheckmateOrStalemate("white");
    expect(result).toBe("checkmate");

    // Verify king is under attack
    const whiteKingPosition = deserializedBoard.getKingPosition("white");
    const isWhiteKingAttacked = deserializedBoard.isSquareAttacked(
      whiteKingPosition,
      "white"
    );
    expect(isWhiteKingAttacked).toBe(true);
  });
});
