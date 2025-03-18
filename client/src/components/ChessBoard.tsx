import { usePointerTracking } from "../hooks/usePointerTracking.tsx";
import useChessGameState from "../hooks/useChessGameState.tsx";
import { Socket } from "socket.io-client";
import "../styles/ChessBoard.css";
import PlayerCard from "./PlayerCard.tsx";

const ChessBoard = ({
  playerColor,
  socket,
  roomId,
  name,
  opponentName,
  connected,
}: {
  playerColor: string;
  socket: Socket;
  roomId: string;
  name: string;
  opponentName: string;
  connected: boolean;
}) => {
  const {
    board,
    turn,
    availableMoves,
    detailedAvailableMoves,
    fromSquare,
    selectSquare,
    movePiece,
  } = useChessGameState(playerColor, socket, roomId);

  const pointerState = usePointerTracking(movePiece);

  const getBoard = (playerColor: string) => {
    if (playerColor === "black") {
      // Reverse both rows and columns for a proper 180° rotation
      return board
        .getBoard()
        .slice()
        .reverse()
        .map((row) => row.slice().reverse());
    }
    return board.getBoard();
  };

  const isLastMove = (square: string) => {
    const lastMove = board.getHistory()[board.getHistory().length - 1];
    if (!lastMove) return false;

    return (
      lastMove.getFrom()?.getPosition() === square ||
      lastMove.getMove()?.square === square
    );
  };

  const isInCheck = () => {
    const lastMove = board.getHistory()[board.getHistory().length - 1];
    return lastMove?.getMove().isCheck;
  };

  return (
    <div className="chessboard-container">
      <div className="player-card-left">
        <PlayerCard
          name={opponentName}
          connected={connected}
          orientation="left"
        />
      </div>

      <div className="chessboard">
        {getBoard(playerColor).flatMap((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square =
              playerColor === "black"
                ? board.indexToSquare([7 - rowIndex, 7 - colIndex])
                : board.indexToSquare([rowIndex, colIndex]);
            const isBlack = (rowIndex + colIndex) % 2 === 1;

            // Determine square style based on game state
            const squareStyle = isLastMove(square)
              ? {
                  boxShadow: "inset 0 0 100rem rgba(255, 183, 0, 0.6)",
                  transition: "background-color 0.2s ease-in-out",
                }
              : isInCheck() &&
                piece?.getColor() === turn &&
                piece?.getName?.() === "king"
              ? {
                  boxShadow: "inset 0 0 100rem rgba(255, 0, 0, 0.6)",
                  transition: "background-color 0.2s ease-in-out",
                }
              : {};

            // Find if current move is a capture
            const isCapture = detailedAvailableMoves.find(
              (move) => move.square === square
            )?.isCapture;

            return (
              <div
                key={square}
                data-square={square}
                className={`square ${isBlack ? "black" : "white"} ${
                  availableMoves.includes(square) && !pointerState.isDown
                    ? "available-move"
                    : ""
                } ${pointerState.isDown ? "grabbing" : ""}`}
                onPointerDown={
                  !fromSquare
                    ? () => selectSquare(square)
                    : () => movePiece(square)
                }
                onPointerEnter={(e) => {
                  const indicator = e.currentTarget.querySelector(
                    ".indicator"
                  ) as HTMLElement | null;
                  if (indicator) {
                    indicator.classList.add("hover");
                    e.currentTarget.style.filter = "brightness(1.1)";
                  }
                }}
                onPointerLeave={(e) => {
                  const indicator = e.currentTarget.querySelector(
                    ".indicator"
                  ) as HTMLElement | null;
                  if (indicator) {
                    indicator.classList.remove("hover");
                  }
                  e.currentTarget.style.filter = "none";
                }}
                onPointerUp={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
                style={squareStyle}
              >
                {/* Move indicators */}
                {availableMoves.includes(square) && (
                  <div
                    className={`indicator ${isCapture ? "capture" : "move"}`}
                  ></div>
                )}

                {piece && (
                  <div
                    className={`piece ${
                      pointerState.isDown && fromSquare === square
                        ? "dragging"
                        : ""
                    }`}
                    style={
                      pointerState.isDown && fromSquare === square
                        ? {
                            left: `${pointerState.position.x - 25}px`,
                            top: `${pointerState.position.y - 25}px`,
                          }
                        : {}
                    }
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

      <div className="player-card-right">
        <PlayerCard name={name} connected={connected} orientation="right" />
      </div>
    </div>
  );
};

export default ChessBoard;
