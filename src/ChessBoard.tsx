import { useState } from "react";
import { Board } from "./game/Board.ts";

const ChessBoard = () => {
  // Initialize board and player
  const [board, setBoard] = useState(new Board());

  return (
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
              className={`square ${isBlack ? "black" : "white"}`}
              style={{
                backgroundColor: isBlack ? "#b58863" : "#f0d9b5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {piece && (
                <div
                  className="piece"
                  style={{
                    cursor: "pointer",
                    marginTop: "4px",
                  }}
                >
                  <img
                    src={`/assets/${piece.getColor()[0]}${piece
                      .getName()[0]
                      .toUpperCase()}${piece.getName()[1]}.svg`}
                    alt={`${piece.getColor()} ${piece.getName()}`}
                    width="50"
                    height="50"
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

export default ChessBoard;
