import "../styles/ChessBoard.css";

// Helper function to convert row and column indices to square notations
const indexToSquare = (row: number, col: number) => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const rank = 8 - row;
  const file = files[col];
  return `${file}${rank}`;
};

const StaticChessBoard = ({
  boardState,
  playerColor,
}: {
  boardState: (string | null)[][];
  playerColor: string;
}) => {
  // Adjust board orientation for black
  const displayBoard =
    playerColor === "black"
      ? boardState
          .slice()
          .reverse()
          .map((row) => row.slice().reverse())
      : boardState;

  return (
    <div className="chessboard">
      {displayBoard.flatMap((row: (string | null)[], rowIndex: number) =>
        row.map((piece, colIndex) => {
          // Determine square color: alternates based on row + column index
          const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
          // Map indices to square notation for keys and data attributes
          const square =
            playerColor === "black"
              ? indexToSquare(7 - rowIndex, 7 - colIndex)
              : indexToSquare(rowIndex, colIndex);

          return (
            <div
              key={square}
              data-square={square}
              className={`square ${isBlackSquare ? "black" : "white"}`}
            >
              {piece && (
                <div className="piece">
                  <img
                    src={`/assets/${piece}.svg`}
                    alt={piece}
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
  );
};

export default StaticChessBoard;
