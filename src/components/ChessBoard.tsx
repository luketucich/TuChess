import { usePointerTracking } from "../hooks/usePointerTracking.tsx";
import useChessGameState from "../hooks/useChessGameState.tsx";
import "../styles/ChessBoard.css";

const ChessBoard = () => {
  const {
    board,
    turn,
    gameOver,
    availableMoves,
    detailedAvailableMoves,
    fromSquare,
    selectSquare,
    movePiece,
  } = useChessGameState();

  const pointerState = usePointerTracking(movePiece);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        {gameOver ? "game over :(" : `${turn} to move`}
      </h1>

      <div
        className="chessboard"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 50px)",
          gridTemplateRows: "repeat(8, 50px)",
          touchAction: "none",
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
                  backgroundColor: isBlack ? "#A2B3C1" : "#E3F0F9",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  cursor:
                    availableMoves.includes(square) && !pointerState.isDown
                      ? "pointer"
                      : pointerState.isDown
                      ? "grabbing"
                      : "grab",
                }}
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
                    indicator.style.scale = 1.3;
                    e.currentTarget.style.filter = "brightness(1.1)";
                  }
                }}
                onPointerLeave={(e) => {
                  const indicator = e.currentTarget.querySelector(
                    ".indicator"
                  ) as HTMLElement | null;
                  if (indicator) {
                    indicator.style.scale = 1;
                  }
                  e.currentTarget.style.filter = "none";
                }}
                onPointerUp={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
              >
                {/* Move indicators */}
                {availableMoves.includes(square) && (
                  <div
                    className="indicator"
                    style={{
                      ...(() => {
                        const move = detailedAvailableMoves.find(
                          (move) => move.square === square
                        );
                        const isCapture = move?.isCapture;
                        return {
                          height: isCapture ? "41px" : "14px",
                          width: isCapture ? "41px" : "14px",
                          backgroundColor: isCapture
                            ? "none"
                            : "rgba(0, 0, 0, 0.25)",
                          borderRadius: "50%",
                          border: isCapture
                            ? "4.5px solid rgba(0, 0, 0, 0.25)"
                            : "none",
                        };
                      })(),
                    }}
                  ></div>
                )}
                {piece && (
                  <div
                    className="piece"
                    style={{
                      marginTop: "4px",
                      ...(pointerState.isDown && fromSquare === square
                        ? {
                            position: "fixed",
                            left: `${pointerState.position.x - 25}px`,
                            top: `${pointerState.position.y - 25}px`,
                            pointerEvents: "none",
                            scale: 1.3,
                            zIndex: 10,
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
