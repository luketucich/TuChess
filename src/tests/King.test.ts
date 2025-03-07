import { describe, expect, test } from "vitest";
import { King } from "../game/Pieces/King.ts";
import { Board } from "../game/Board.ts";
import { Queen } from "../game/Pieces/Queen.ts";
import { Bishop } from "../game/Pieces/Bishop.ts";
import { Knight } from "../game/Pieces/Knight.ts";
import { Pawn } from "../game/Pieces/Pawn.ts";
import { Rook } from "../game/Pieces/Rook.ts";
import { Player } from "../game/Player.ts";

describe("King properties", () => {
  test("White king should have the correct properties", () => {
    const king = new King("white", "e1");
    expect(king.getColor()).toBe("white");
    expect(king.getPosition()).toBe("e1");
    expect(king.getValue()).toBe(Infinity);
    expect(king.getName()).toBe("king");
  });

  test("Black king should have the correct properties", () => {
    const king = new King("black", "e8");
    expect(king.getColor()).toBe("black");
    expect(king.getPosition()).toBe("e8");
    expect(king.getValue()).toBe(Infinity);
    expect(king.getName()).toBe("king");
  });
});

describe("King movement", () => {
  test("King should be able to move to any adjacent square", () => {
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));
    const king = board.getSquare("e4") as King;
    const moves = king.getMoves(board);

    expect(moves.length).toBe(8);
    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f3",
      },
    ]);
  });

  test("King should not be able to move to squares attacked by enemy king", () => {
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));
    board.setSquare("e6", new King("black", "e6"));
    const king = board.getSquare("e4") as King;
    const moves = king.getMoves(board);

    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f3",
      },
    ]);
  });

  test("King should not be able to move to squares attacked by enemy queen", () => {
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));
    board.setSquare("f6", new Queen("black", "f6"));
    const king = board.getSquare("e4") as King;
    const moves = king.getMoves(board);

    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
    ]);
  });

  test("King should not be able to move to squares attacked by enemy bishop", () => {
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));
    board.setSquare("d6", new Bishop("black", "d6"));
    const king = board.getSquare("e4") as King;
    const moves = king.getMoves(board);

    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f3",
      },
    ]);
  });

  test("King should not be able to move to squares attacked by enemy knight", () => {
    const board = new Board();
    board.setSquare("d4", new King("white", "d4"));
    board.setSquare("f6", new Knight("black", "f6"));
    const king = board.getSquare("d4") as King;
    const moves = king.getMoves(board);

    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "c5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "c4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "c3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
    ]);
  });

  test("King should not be able to move to squares attacked by enemy rooks", () => {
    const board = new Board();
    board.setSquare("d4", new King("white", "d4"));
    board.setSquare("c6", new Rook("black", "c6"));
    board.setSquare("f5", new Rook("black", "f5"));
    const king = board.getSquare("d4") as King;
    const moves = king.getMoves(board);

    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
    ]);
  });

  test("King should not be able to move to squares attacked by enemy pawn", () => {
    const board = new Board();
    board.setSquare("e4", new King("white", "e4"));
    board.setSquare("e6", new Pawn("black", "e6"));
    const king = board.getSquare("e4") as King;
    const moves = king.getMoves(board);

    expect(moves).toEqual([
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e5",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f4",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "d3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "e3",
      },
      {
        color: "white",
        isCapture: false,
        isCheck: false,
        piece: "king",
        square: "f3",
      },
    ]);
  });
});

describe("King castling", () => {
  test("King should be able to short castle", () => {
    const board = new Board();
    const king = new King("white", "e1");
    const rook = new Rook("white", "h1");
    board.setSquare("f1", null);
    board.setSquare("g1", null);

    expect(king.getHasMoved()).toBe(false);
    expect(rook.getHasMoved()).toBe(false);

    expect(king.getMoves(board)).toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "g1",
      isCastle: true,
    });
  });

  test("King should be able to long castle", () => {
    const board = new Board();
    const player = new Player("white", true);
    const king = board.getSquare("e1") as King;
    const rook = board.getSquare("a1") as Rook;
    board.setSquare("b1", null);
    board.setSquare("c1", null);
    board.setSquare("d1", null);

    expect(king.getHasMoved()).toBe(false);
    expect(rook.getHasMoved()).toBe(false);

    expect(king.getMoves(board)).toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "c1",
      isCastle: true,
    });

    board.movePiece("e1", "c1", player);

    expect(king.getHasMoved()).toBe(true);
    expect(rook.getHasMoved()).toBe(true);
  });

  test("King should not be able to castle if it has moved", () => {
    const board = new Board();
    const king = new King("white", "e1");
    king.move("e2");

    expect(king.getHasMoved()).toBe(true);
    expect(king.getMoves(board)).not.toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "g1",
      isCastle: true,
    });
  });

  test("King should not be able to castle if the rook has moved", () => {
    const board = new Board();
    const king = new King("white", "e1");
    const rook = new Rook("white", "h1");
    rook.move("h2");

    expect(king.getHasMoved()).toBe(false);
    expect(rook.getHasMoved()).toBe(true);
    expect(king.getMoves(board)).not.toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "g1",
      isCastle: true,
    });
  });

  test("King should not be able to castle if the path is blocked", () => {
    const board = new Board();
    const king = new King("white", "e1");
    const rook = new Rook("white", "h1");
    board.setSquare("f1", new Pawn("white", "f1"));

    expect(king.getHasMoved()).toBe(false);
    expect(rook.getHasMoved()).toBe(false);
    expect(king.getMoves(board)).not.toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "g1",
      isCastle: true,
    });
  });

  test("King should not be able to castle if the path is attacked", () => {
    const board = new Board();
    const king = new King("white", "e1");
    const rook = new Rook("white", "h1");
    board.setSquare("f1", new Queen("black", "f1"));

    expect(king.getHasMoved()).toBe(false);
    expect(rook.getHasMoved()).toBe(false);
    expect(king.getMoves(board)).not.toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "g1",
      isCastle: true,
    });
  });

  test("King should not be able to castle if in check", () => {
    const board = new Board();
    const king = new King("white", "e1");
    const rook = new Rook("white", "h1");
    board.setSquare("f1", new Queen("black", "f1"));
    board.setSquare("e2", new Queen("black", "e2"));

    expect(king.getHasMoved()).toBe(false);
    expect(rook.getHasMoved()).toBe(false);
    expect(king.getMoves(board)).not.toContainEqual({
      color: "white",
      isCapture: false,
      isCheck: false,
      piece: "king",
      square: "g1",
      isCastle: true,
    });
  });
});
