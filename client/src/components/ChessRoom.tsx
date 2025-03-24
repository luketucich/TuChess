import { useState, useEffect, useRef, useCallback } from "react";
import ChessBoard from "./ChessBoard";
import "../styles/Styles.css";
import "../styles/ChessRoom.css";
import QueueGrid from "./QueueGrid";
import { useAppContext } from "../context/AppContext";

function ChessRoom() {
  // Context and user state
  const { socket, user, setErrorMessage } = useAppContext();
  const [username, setUsername] = useState(
    user?.email?.split("@")[0] || "Anonymous"
  );
  const [opponentUsername, setOpponentUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [timeControl, setTimeControl] = useState({ time: 0, increment: 0 });

  // Room status
  const [isInRoom, setIsInRoom] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Game state
  const [receivedGameState, setReceivedGameState] = useState<{
    serializedBoard: string;
    turn: "white" | "black";
    gameOver: boolean;
    whiteTime: number;
    blackTime: number;
    increment: number;
  } | null>(null);

  // Available rooms
  const [rooms, setRooms] = useState<
    {
      roomId: string;
      users: {
        id: string;
        authId: string;
        username?: string;
        color?: string;
        isConnected: boolean;
      }[];
    }[]
  >([]);

  // Refs
  const joinAudioRef = useRef(new Audio("/assets/join_room.mp3"));
  const pollingIntervalRef = useRef<number | null>(null);

  const playJoinSound = () => {
    joinAudioRef.current.currentTime = 0;
    joinAudioRef.current
      .play()
      .catch((err) => console.error("Error playing audio:", err));
  };

  const fetchRooms = useCallback(() => {
    if (socket) {
      socket.emit("get-rooms");
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("rooms-update", (roomsData) => {
      setRooms(roomsData);

      // Check if user was in a room before
      const lastRoom = roomsData.find(
        (room: {
          roomId: string;
          users: {
            id: string;
            authId: string;
            isConnected: boolean;
            username?: string;
          }[];
        }) => {
          // For each room, check if there's a user matching this client
          return room.users.some((u) => {
            // Match by authId for logged-in users
            if (user && user.id && u.authId === user.id) {
              return true;
            }
            // For anonymous users, try to match by last socket ID
            if (
              !user &&
              localStorage.getItem("lastSocketId") &&
              u.id === localStorage.getItem("lastSocketId")
            ) {
              return true;
            }
            // Last resort - match by socket ID for just-connected sockets
            return u.id === socket.id;
          });
        }
      );

      if (lastRoom && !isInRoom && !isReconnecting) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setIsReconnecting(true);
        if (!user) {
          socket.emit(
            "reconnect",
            lastRoom.roomId,
            localStorage.getItem("lastSocketId")
          );
        } else {
          socket.emit("reconnect", lastRoom.roomId);
        }
        setRoomId(lastRoom.roomId);
      }
    });

    // Rest of the event listeners remain the same
    socket.on("reconnect-failed", (reason) => {
      console.error("Reconnection failed:", reason);
      setIsReconnecting(false);
      setIsInRoom(false);
      setErrorMessage(`${reason}`);
      setReceivedGameState(null);
      setRoomId("");
      setIsRoomFull(false);

      // Restart polling for rooms
      if (!pollingIntervalRef.current) {
        pollingIntervalRef.current = window.setInterval(() => {
          fetchRooms();
        }, 1000);
      }
    });

    socket.on("send-room-occupancy", (roomOccupancy) => {
      console.log("Room occupancy:", roomOccupancy);
      if (roomOccupancy === 2) {
        setIsRoomFull(true);
      }
    });

    socket.on("send-game-state", (gameState) => {
      setReceivedGameState(gameState);
      setIsInRoom(true);
    });

    fetchRooms();

    // Setup polling mechanism
    if (!isInRoom) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = window.setInterval(() => {
        fetchRooms();
      }, 1000);
    } else if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    return () => {
      socket.off("rooms-update");
      socket.off("reconnect-failed");
      socket.off("send-room-occupancy");
      socket.off("send-game-state");
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [socket, user, isInRoom, fetchRooms, isReconnecting, setErrorMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "send-username",
      (opponentUsername: string, opponentId: string) => {
        if (socket.id !== opponentId) {
          setOpponentUsername(opponentUsername);
          console.log(`Received opponent username: ${opponentUsername}`);
        }
      }
    );

    socket.on("player-joined-room", (roomOccupancy) => {
      if (isInRoom && roomOccupancy === 2) {
        setIsRoomFull(true);
      }
    });

    socket.on("reconnect-success", () => {
      socket.emit("get-opponent-username", roomId);
      setIsReconnecting(false);
      setIsInRoom(true);
      setErrorMessage("");
    });

    return () => {
      socket.off("send-username");
      socket.off("player-joined-room");
      socket.off("reconnect-success");
    };
  }, [socket, isInRoom, roomId]);

  // Update username when user changes
  useEffect(() => {
    if (user && user.email) {
      setUsername(user.email.split("@")[0]);
    }
  }, [user]);

  // Share username when joining or reconnecting
  useEffect(() => {
    if (socket && isInRoom && roomId) {
      socket.emit("share-username", roomId, username);
      socket.emit("get-opponent-username", roomId);
    }
  }, [socket, isInRoom, roomId, username]);

  // Start game when room is full
  useEffect(() => {
    if (isInRoom && isRoomFull) {
      handleStartGame(roomId, timeControl);
      playJoinSound();
    }
  }, [isInRoom, isRoomFull, roomId, timeControl]);

  const fetchPlayerInfo = (roomId: string) => {
    const room = rooms.find((room) => room.roomId === roomId);
    const playerInfo = room?.users?.find((user) => user.id === socket?.id);
    return playerInfo;
  };

  const handleStartGame = (
    roomId: string,
    timeControl: { time: number; increment: number }
  ) => {
    if (!isReconnecting) {
      localStorage.setItem("lastSocketId", socket?.id || "");
      socket?.emit("start-game", roomId, timeControl);
    }
  };

  return (
    <div className="chess-room-container">
      {!isInRoom ? (
        <QueueGrid
          setIsInRoom={setIsInRoom}
          setRoomId={setRoomId}
          setUsername={setUsername}
          defaultUsername={username}
          rooms={rooms}
          setTimeControl={setTimeControl}
        />
      ) : (
        <div className="game-container">
          {!isRoomFull ? (
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
                {isReconnecting
                  ? "Reconnecting to your game..."
                  : "Waiting for another player to join"}
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
                  roomId={roomId}
                  name={username}
                  opponentName={opponentUsername}
                  timeControl={timeControl}
                  receivedGameState={receivedGameState}
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
