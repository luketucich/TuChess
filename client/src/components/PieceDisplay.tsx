import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import "../styles/PieceDisplay.css";

const PieceDisplay = ({ playerColor }: { playerColor: string }) => {
  const { socket } = useAppContext();
  const [pieces, setPieces] = useState<string[]>([]);
  const opponentColor = playerColor === "white" ? "black" : "white";
  const getPieceValue = (pieceName: string) => {
    switch (pieceName[0] + pieceName[1]) {
      case "pa":
        return 1;
      case "kn":
        return 3;
      case "bi":
        return 3;
      case "ro":
        return 5;
      case "qu":
        return 9;
      case "ki":
        return 100;
      default:
        return 0;
    }
  };

  useEffect(() => {
    socket?.on("update-pieces", (updatedPieces: string[], color: string) => {
      if (color === playerColor)
        setPieces(
          [...updatedPieces].sort((a, b) => getPieceValue(a) - getPieceValue(b))
        );
    });

    return () => {
      socket?.off("update-pieces");
    };
  }, [socket, playerColor]);

  return (
    pieces.length > 0 && (
      <div className="piece-display-container">
        {pieces.map((pieceName, index) => (
          <div key={index} className="piece-item">
            <img
              style={{
                filter:
                  opponentColor === "black"
                    ? "drop-shadow(0 0 0.15rem rgba(200, 200, 200, 0.5))"
                    : "drop-shadow(-0.05rem 0 0.2rem rgba(0, 0, 0, 0.5))",
              }}
              src={`/assets/${opponentColor[0]}${pieceName[0].toUpperCase()}${
                pieceName[1]
              }.svg`}
              alt={`${opponentColor} ${pieceName}`}
            />
          </div>
        ))}
      </div>
    )
  );
};

export default PieceDisplay;
