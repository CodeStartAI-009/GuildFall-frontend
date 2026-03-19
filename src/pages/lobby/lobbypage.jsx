import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../socket/socket";

import "./Lobby.css";

export default function Lobby() {

  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const socket = getSocket();

  const [room, setRoom] = useState(null);

  /* ===============================
     CONNECT + JOIN ROOM
  =============================== */

  useEffect(() => {

    if (!user || !roomId) return;

    if (!socket.connected) {
      socket.connect();
    }

    /* 🔥 FIX: DELAYED JOIN (prevents "Room not found") */
    const joinTimeout = setTimeout(() => {
      socket.emit("join_room", { roomId, user });
    }, 200);

    /* ===============================
       SOCKET EVENTS
    =============================== */

    const handleRoomUpdate = (updatedRoom) => {
      setRoom(updatedRoom);
    };

    const handleError = (msg) => {
      alert(msg);
      navigate("/");
    };

    const handleGameStarted = (data) => {
      const id = data.roomId || roomId; // 🔥 fallback
    
      console.log("🎮 Navigating to:", id);
    
      navigate(`/game/${id}`);
    };

    socket.on("room_update", handleRoomUpdate);
    socket.on("error_message", handleError);
    socket.on("game_started", handleGameStarted);

    return () => {
      clearTimeout(joinTimeout);
      socket.off("room_update", handleRoomUpdate);
      socket.off("error_message", handleError);
      socket.off("game_started", handleGameStarted);
    };

  }, [roomId, user, navigate]);

  /* ===============================
     LOADING
  =============================== */

  if (!room) {
    return (
      <div className="lobby-root">
        <h2>Joining room...</h2>
      </div>
    );
  }

  /* 🔥 FIX: STRING SAFE COMPARISON */
  const isHost = String(room.host) === String(user?._id);

  const currentPlayer = room.players?.find(
    (p) => String(p.userId) === String(user?._id)
  );

  /* ===============================
     READY TOGGLE
  =============================== */

  const handleReady = () => {
    socket.emit("toggle_ready", {
      roomId,
      userId: user._id
    });
  };

  /* ===============================
     START GAME
  =============================== */

  const handleStart = () => {
    socket.emit("start_game", {
      roomId,
      userId: user._id
    });
  };

  return (

    <div className="lobby-root">

      {/* Header */}
      <h1 className="lobby-title">Game Lobby</h1>
      <h3 className="lobby-room">Room ID: {roomId}</h3>

      {/* ===============================
          PLAYER LIST
      =============================== */}
      <div className="players-box">

        {room.players?.map((player) => {

          const isHostPlayer =
            String(player.userId) === String(room.host);

          return (
            <div
              key={player.userId}
              className={`player-card ${player.ready ? "ready" : ""}`}
            >

              {/* LEFT */}
              <div className="player-left">

                <div className="player-avatar">
                  {player.username?.charAt(0).toUpperCase()}
                </div>

                <div className="player-name">
                  {player.username}

                  {isHostPlayer && (
                    <span className="host-badge">HOST</span>
                  )}
                </div>

              </div>

              {/* RIGHT */}
              <div
                className={`player-status ${
                  player.ready ? "status-ready" : "status-notready"
                }`}
              >
                {player.ready ? "READY" : "NOT READY"}
              </div>

            </div>
          );
        })}

      </div>

      {/* ===============================
          ACTION BUTTONS
      =============================== */}
      <div className="lobby-actions">

        <button
          className="ready-btn"
          onClick={handleReady}
        >
          {currentPlayer?.ready ? "Unready" : "Ready"}
        </button>

        {isHost && (
          <button
            className="start-btn"
            onClick={handleStart}
          >
            Start Game
          </button>
        )}

      </div>

    </div>
  );
}