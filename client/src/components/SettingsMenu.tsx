import { useAppContext } from "../context/AppContext";
import { X } from "react-feather";
import PropChessBoard from "./PropChessBoard";
import "../styles/SettingsMenu.css";

const SettingsMenu = ({
  setShowSettingsMenu,
}: {
  setShowSettingsMenu: (showSettingsMenu: boolean) => void;
}) => {
  const { boardTheme, setBoardTheme } = useAppContext();

  // Board state for preview
  const propBoardState: (string[] | null[])[] = [
    ["bRo", "bKn", "bBi", "bQu", "bKi", "bBi", "bKn", "bRo"],
    ["bPa", "bPa", "bPa", "bPa", "bPa", "bPa", "bPa", "bPa"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wPa", "wPa", "wPa", "wPa", "wPa", "wPa", "wPa", "wPa"],
    ["wRo", "wKn", "wBi", "wQu", "wKi", "wBi", "wKn", "wRo"],
  ];

  return (
    <div className="settings-menu">
      <div className="settings-menu-container">
        <button
          className="settings-menu-close"
          onClick={() => setShowSettingsMenu(false)}
        >
          <X className="settings-menu-close-icon" />
        </button>
        <h1 className="settings-menu-heading">Settings</h1>

        <h2 className="settings-menu-subheading">Board Theme</h2>
        <select
          className="board-theme-select"
          value={boardTheme}
          onChange={(e) => setBoardTheme?.(e.target.value)}
        >
          <option className="board-theme-option" value="mocha">
            Mocha
          </option>
          <option className="board-theme-option" value="blueberry">
            Blueberry
          </option>
          <option className="board-theme-option" value="pistachio">
            Pistachio
          </option>
          <option className="board-theme-option" value="sakura">
            Sakura
          </option>
        </select>

        <PropChessBoard boardState={propBoardState} playerColor="white" />
      </div>
    </div>
  );
};

export default SettingsMenu;
