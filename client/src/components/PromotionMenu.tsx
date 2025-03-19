import "../styles/PromotionMenu.css";

const PromotionMenu = ({
  onSelect,
  color,
}: {
  onSelect: (piece: string) => void;
  color: string;
}) => {
  const pieces = [
    { value: "queen", code: "Qu" },
    { value: "rook", code: "Ro" },
    { value: "bishop", code: "Bi" },
    { value: "knight", code: "Kn" },
  ];

  return (
    <div className="promotion-menu">
      {pieces.map((piece) => (
        <button
          key={piece.value}
          className="promotion-piece"
          onClick={() => onSelect(piece.value)}
        >
          <img
            src={`/assets/${color}${piece.code}.svg`}
            alt={`${color === "w" ? "white" : "black"} ${piece.value}`}
          />
        </button>
      ))}
    </div>
  );
};

export default PromotionMenu;
