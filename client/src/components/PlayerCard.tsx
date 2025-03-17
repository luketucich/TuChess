import { BarChart } from "react-feather";
import "../styles/PlayerCard.css";

const PlayerCard = ({
  name,
  connected,
}: {
  name: string;
  connected: boolean;
}) => {
  return (
    <div className="player-card">
      <div className="player-card__icon">
        <BarChart
          className={`player-card__status-icon ${
            connected ? "connected" : "disconnected"
          }`}
          size={24}
          strokeWidth={3}
        />
      </div>
      <h3 className="player-card__name">{name}</h3>
    </div>
  );
};

export default PlayerCard;
