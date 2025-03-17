import { FC } from "react";
import "../styles/QueueGrid.css";

interface TimeControl {
  time: number;
  increment: number;
}

interface TimeControls {
  bullet: TimeControl[];
  blitz: TimeControl[];
  rapid: TimeControl[];
  classical: TimeControl[];
}

const QueueGrid: FC = () => {
  // Time control options for each category
  const timeControls: TimeControls = {
    bullet: [
      { time: 1, increment: 0 },
      { time: 1, increment: 1 },
      { time: 2, increment: 0 },
    ],
    blitz: [
      { time: 3, increment: 0 },
      { time: 3, increment: 2 },
      { time: 5, increment: 0 },
    ],
    rapid: [
      { time: 10, increment: 0 },
      { time: 10, increment: 5 },
      { time: 15, increment: 10 },
    ],
    classical: [
      { time: 30, increment: 0 },
      { time: 30, increment: 20 },
      { time: 60, increment: 30 },
    ],
  };

  // Format time display
  const formatTimeControl = (time: number, increment: number): string => {
    return `${time} + ${increment}`;
  };

  return (
    <div className="queue-grid-container">
      <div className="queue-grid">
        {/* Bullet Section */}
        <div className="queue-section">
          <div className="section-header">
            <div className="section-icon-placeholder"></div>
            <h2>Bullet</h2>
          </div>
          <div className="time-options">
            {timeControls.bullet.map((control, index) => (
              <button key={`bullet-${index}`} className="time-option">
                <span className="time-display">
                  {formatTimeControl(control.time, control.increment)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Blitz Section */}
        <div className="queue-section">
          <div className="section-header">
            <div className="section-icon-placeholder"></div>
            <h2>Blitz</h2>
          </div>
          <div className="time-options">
            {timeControls.blitz.map((control, index) => (
              <button key={`blitz-${index}`} className="time-option">
                <span className="time-display">
                  {formatTimeControl(control.time, control.increment)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rapid Section */}
        <div className="queue-section">
          <div className="section-header">
            <div className="section-icon-placeholder"></div>
            <h2>Rapid</h2>
          </div>
          <div className="time-options">
            {timeControls.rapid.map((control, index) => (
              <button key={`rapid-${index}`} className="time-option">
                <span className="time-display">
                  {formatTimeControl(control.time, control.increment)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Classical Section */}
        <div className="queue-section">
          <div className="section-header">
            <div className="section-icon-placeholder"></div>
            <h2>Classical</h2>
          </div>
          <div className="time-options">
            {timeControls.classical.map((control, index) => (
              <button key={`classical-${index}`} className="time-option">
                <span className="time-display">
                  {formatTimeControl(control.time, control.increment)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Button */}
      <div className="custom-game-container">
        <button className="custom-game-button">
          <span>Custom</span>
        </button>
      </div>
    </div>
  );
};

export default QueueGrid;
