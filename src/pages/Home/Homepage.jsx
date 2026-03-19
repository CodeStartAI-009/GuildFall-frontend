import "./Home.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "./AuthModal";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaCog,
  FaDiscord,
  FaExpand,
  FaArrowLeft,
} from "react-icons/fa";

import gameLogo from "../../assets/logo/logo.png";
import companyLogo from "../../assets/logo/company.jpeg";
import Leaderboard from "./Leaderboard";
import { getSocket } from "../../socket/socket";

export default function Home() {
  const PUBLIC_ROOM_ID = "PUBLIC_ROOM";
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = getSocket();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [showPlayMenu, setShowPlayMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showJoinMenu, setShowJoinMenu] = useState(false);

  const [maxPlayers, setMaxPlayers] = useState(2);
  const [roomCode, setRoomCode] = useState("");

  /* ===============================
     CONNECT SOCKET
  =============================== */
  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("room_created", ({ roomId }) => {
      navigate(`/lobby/${roomId}`);
    });

    socket.on("joined_room", ({ roomId }) => {
      navigate(`/lobby/${roomId}`);
    });

    socket.on("game_started", () => {
      navigate(`/game/PUBLIC_ROOM`)
    });

    socket.on("error_message", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("room_created");
      socket.off("joined_room");
      socket.off("game_started");
      socket.off("error_message");
    };

  }, [socket, navigate]);

  /* ===============================
     GUEST POPUP
  =============================== */
  useEffect(() => {
    if (user?.isGuest) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!user) return null;

  /* ===============================
     CREATE ROOM
  =============================== */
  const handleCreateRoom = () => {
    socket.emit("create_room", {
      user,
      maxPlayers,
    });
  };

  /* ===============================
     JOIN ROOM BY CODE
  =============================== */
  const handleJoinByCode = () => {

    if (!roomCode) {
      alert("Enter room code");
      return;
    }

    socket.emit("join_room", {
      roomId: roomCode,
      user
    });
  };

  /* ===============================
     JOIN RANDOM (PUBLIC)
  =============================== */
  const handleJoinRandom = () => {
    socket.emit("join_public", { user });
  };

  return (

    <div className="home-root">
      {/* ---------------- LEVEL SECTION ---------------- */}
<div className="level-section">

<div className="level-badge">
  Lv {user.level || 1}
</div>

<div className="xp-wrapper">

  <div className="xp-bar">
    <div
      className="xp-fill"
      style={{
        width: `${((user.xp || 0) % 100)}%`
      }}
    />
  </div>

  <div className="xp-text">
    {(user.xp || 0) % 100} / 100 XP
  </div>

</div>

</div>

{/* ---------------- LEFT PANEL ---------------- */}
<div className="left-panel">

{/* ECONOMY */}
<div className="economy-box">

  <div className="currency">
    🪙 Coins: {user.coins || 0}
  </div>

</div>

</div>
      {/* TOP RIGHT SIGN */}
      {user.isGuest && (
        <div className="top-right">
          <button
            className="sign-icon-btn"
            onClick={() => setShowAuthModal(true)}
          >
            <FaUserCircle size={22} />
          </button>
        </div>
      )}

      {/* POPUP */}
      {user.isGuest && showPopup && (
        <div className="mana-popup">
          ✨ Sign in to receive 200 Mana Points
        </div>
      )}

      {/* LEADERBOARD */}
      <div
        className="leaderboard-icon"
        onClick={() => setShowLeaderboard(true)}
      >
        🏆
      </div>

      {showLeaderboard && (
        <div
          className="leaderboard-overlay"
          onClick={() => setShowLeaderboard(false)}
        >
          <div
            className="leaderboard-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <Leaderboard />

            <button
              className="close-btn"
              onClick={() => setShowLeaderboard(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* CENTER */}
      <div className="center-content">

        <div className="game-logo">
          <img src={gameLogo} alt="Game Logo" />
        </div>

        <div className="bottom-actions">
          <button
            className="royal-play-btn"
            onClick={() => setShowPlayMenu(true)}
          >
            PLAY
          </button>
        </div>

      </div>

      {/* ===============================
         PLAY MODAL
      =============================== */}
      {showPlayMenu && (
        <div
          className="play-backdrop"
          onClick={() => setShowPlayMenu(false)}
        >
          <div
            className="play-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-back-btn"
              onClick={() => setShowPlayMenu(false)}
            >
              <FaArrowLeft />
            </button>

            <h2>Select Mode</h2>

            <button
              className="royal-small-btn modal-btn"
              onClick={() => {
                setShowPlayMenu(false);
                setShowCreateMenu(true);
              }}
            >
              CREATE
            </button>

            <button
              className="royal-small-btn modal-btn"
              onClick={() => {
                setShowPlayMenu(false);
                setShowJoinMenu(true);
              }}
            >
              JOIN
            </button>

          </div>
        </div>
      )}

      {/* ===============================
         CREATE ROOM MODAL (UNCHANGED)
      =============================== */}
      {showCreateMenu && (
        <div
          className="play-backdrop"
          onClick={() => setShowCreateMenu(false)}
        >
          <div
            className="play-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-back-btn"
              onClick={() => setShowCreateMenu(false)}
            >
              <FaArrowLeft />
            </button>

            <h2>Select Max Players</h2>

            <div className="player-select">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`royal-small-btn ${
                    maxPlayers === num ? "active-btn" : ""
                  }`}
                  onClick={() => setMaxPlayers(num)}
                >
                  {num} Players
                </button>
              ))}
            </div>

            <button
              className="royal-play-btn create-final-btn"
              onClick={handleCreateRoom}
            >
              CREATE ROOM
            </button>

          </div>
        </div>
      )}

      {/* ===============================
         JOIN MODAL (NEW)
      =============================== */}
      {showJoinMenu && (
        <div
          className="play-backdrop"
          onClick={() => setShowJoinMenu(false)}
        >
          <div
            className="play-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-back-btn"
              onClick={() => setShowJoinMenu(false)}
            >
              <FaArrowLeft />
            </button>

            <h2>Join Game</h2>

            {/* JOIN BY CODE */}
            <div className="join-section">

              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="join-input"
              />

              <button
                className="royal-small-btn modal-btn"
                onClick={handleJoinByCode}
              >
                Join Room
              </button>

            </div>

            {/* RANDOM MATCH */}
            <div className="join-section">

              <button
                className="royal-play-btn"
                onClick={handleJoinRandom}
              >
                🌐 Join Random Match
              </button>

            </div>

          </div>
        </div>
      )}

      {/* AD */}
      <div className="home-side-ad">
        <div id="home-right-ad"></div>
      </div>

      {/* POLICY */}
      <div className="policy-content">
        <div className="policy-links">
          <Link to="/features">Features</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>

      {/* FOOTER */}
      <div className="home-footer">
        <div className="footer-icons">

           

          <button
            onClick={() =>
              window.open("https://discord.gg/ZEnUD5UN", "_blank")
            }
          >
            <FaDiscord />
          </button>

          <button onClick={toggleFullscreen}>
            <FaExpand />
          </button>

          <img src={companyLogo} alt="Company Logo" />

        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
}