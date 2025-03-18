import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ChessBoard from "./ChessBoard";
import "../styles/Styles.css";
import "../styles/ChessRoom.css";
import QueueGrid from "./QueueGrid";

function ChessRoom() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const [opponentUsername, setOpponentUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [timeControl, setTimeControl] = useState({ time: 0, increment: 0 });
  const [isInRoom, setIsInRoom] = useState(false);
  const [rooms, setRooms] = useState<
    {
      roomId: string;
      users: { id: string; username?: string; color?: string }[];
    }[]
  >([]);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const joinAudioRef = useRef(new Audio("/assets/join_room.mp3"));

  const playJoinSound = () => {
    joinAudioRef.current.currentTime = 0;
    joinAudioRef.current
      .play()
      .catch((err) => console.error("Error playing audio:", err));
  };

  // Socket connection setup
  useEffect(() => {
    // socketRef.current = io("http://localhost:3001");
    socketRef.current = io("https://tuchess-1.onrender.com");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("rooms-update", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    socketRef.current.on(
      "send-username",
      (opponentUsername: string, opponentId: string) => {
        if (socketRef.current?.id !== opponentId) {
          setOpponentUsername(opponentUsername);
        }
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Handle starting game when room is full
  useEffect(() => {
    if (isInRoom && isRoomFull(roomId)) {
      handleStartGame(roomId, timeControl);
      playJoinSound();
    }
  }, [isInRoom, rooms, roomId]);

  const isRoomFull = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    return room?.users?.length === 2;
  };

  const fetchPlayerInfo = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    const playerInfo = room?.users?.find(
      (user) => user.id === socketRef.current?.id
    );

    return playerInfo;
  };

  const handleStartGame = (
    roomId: string,
    timeControl: { time: number; increment: number }
  ) => {
    socketRef.current?.emit("start-game", roomId, timeControl);
  };

  return (
    <div className="chess-room-container">
      {!isInRoom ? (
        <QueueGrid
          socket={socketRef.current}
          setIsInRoom={setIsInRoom}
          setRoomId={setRoomId}
          setUsername={setUsername}
          defaultUsername={username}
          rooms={rooms}
          setTimeControl={setTimeControl}
        />
      ) : (
        <div className="game-container">
          {!isRoomFull(roomId) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "colorWave 2s infinite, slowFadeIn 0.5s linear",
                maxWidth: "80%",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "var(--primary-color)",
                  marginBottom: "1rem",
                  textAlign: "center",
                  textWrap: "wrap",
                }}
              >
                Waiting for another player to join
              </h2>
              <img
                src="/assets/logo.svg"
                alt="Loading"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  animation: "spin 2s linear infinite",
                }}
              />
            </div>
          ) : (
            <div className="game-board-container">
              {fetchPlayerInfo(roomId)?.color && (
                <ChessBoard
                  playerColor={fetchPlayerInfo(roomId)?.color as string}
                  socket={socketRef.current as Socket}
                  roomId={roomId}
                  name={username}
                  opponentName={opponentUsername}
                  connected={isConnected}
                  timeControl={timeControl}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChessRoom;
