import { useState } from "react";
import { Board } from "../game/Board.ts";
import { Player } from "../game/Player.ts";
import { BoardMove } from "../game/Board.ts";
import { usePointerTracking } from "./usePointerTracking.tsx";

const ChessBoard = () => {
  // Game state
  const [board, setBoard] = useState<Board>(new Board());
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Selection state
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [detailedAvailableMoves, setDetailedAvailableMoves] = useState<
    BoardMove[]
  >([]);
  const [fromSquare, setFromSquare] = useState<string | null>(null);

  // Handle square selection
  const selectSquare = (square: string) => {
    const piece = board.getSquare(square);

    if (!piece || piece.getColor() !== turn) {
      setFromSquare(null);
      setAvailableMoves([]);
      return;
    }

    const moves = piece.getMoves(board);
    setFromSquare(square);
    setAvailableMoves(moves.map((move) => move.square));
    setDetailedAvailableMoves(moves);
  };

  // Check for game ending conditions
  const checkGameStatus = (newBoard: Board) => {
    if (
      newBoard.isCheckmateOrStalemate("black") !== "none" ||
      newBoard.isCheckmateOrStalemate("white") !== "none"
    ) {
      setGameOver(true);
    }
  };

  // Handle piece movement
  const movePiece = (square: string) => {
    if (!fromSquare) return;

    const piece = board.getSquare(fromSquare);
    if (!piece) return;

    const moves = piece.getMoves(board);
    const validMoveSquares = moves.map((move) => move.square);

    if (!validMoveSquares.includes(square)) {
      selectSquare(square);
      return;
    }

    // Clone the board to avoid direct state mutation
    const newBoard = board.cloneBoard();
    newBoard.movePiece(fromSquare, square, new Player(piece.getColor(), true));

    // Update state
    setBoard(newBoard);
    setFromSquare(null);
    setAvailableMoves([]);
    setTurn(turn === "white" ? "black" : "white");

    // Check for game over conditions
    checkGameStatus(newBoard);
  };

  const pointerState = usePointerTracking(movePiece);

  return (
    <div>
      <h1>{gameOver ? "Game Over" : `Turn: ${turn}`}</h1>

      <div
        className="chessboard"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 50px)",
          gridTemplateRows: "repeat(8, 50px)",
        }}
      >
        {board.getBoard().flatMap((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square = board.indexToSquare([rowIndex, colIndex]);
            const isBlack = (rowIndex + colIndex) % 2 === 1;

            return (
              <div
                key={square}
                data-square={square}
                className={`square ${isBlack ? "black" : "white"}`}
                style={{
                  backgroundColor: isBlack ? "#b58863" : "#f0d9b5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
                onPointerDown={
                  !fromSquare
                    ? () => selectSquare(square)
                    : () => movePiece(square)
                }
              >
                {/* Display dot on squares where piece can move */}
                {availableMoves.includes(square) && (
                  <div
                    style={{
                      height: detailedAvailableMoves.find(
                        (move) => move.square === square
                      )?.isCapture
                        ? "45px"
                        : "13px",
                      width: detailedAvailableMoves.find(
                        (move) => move.square === square
                      )?.isCapture
                        ? "45px"
                        : "13px",
                      backgroundColor: "brown",
                      borderRadius: "50%",
                      display: "inline-block",
                      transition: "height 0.2s, width 0.2s",
                      position: "absolute",
                      zIndex: 1,
                    }}
                  ></div>
                )}
                {piece && (
                  <div
                    className="piece"
                    style={{
                      cursor: "pointer",
                      marginTop: "4px",
                      zIndex: 2,
                      ...(pointerState.isDown && fromSquare === square
                        ? {
                            position: "fixed",
                            left: `${pointerState.position.x - 25}px`,
                            top: `${pointerState.position.y - 25}px`,
                            zIndex: 1000,
                            pointerEvents: "none",
                          }
                        : {}),
                    }}
                  >
                    <img
                      src={`/assets/${piece.getColor()[0]}${piece
                        .getName()[0]
                        .toUpperCase()}${piece.getName()[1]}.svg`}
                      alt={`${piece.getColor()} ${piece.getName()}`}
                      width="50"
                      height="50"
                      draggable="false"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
