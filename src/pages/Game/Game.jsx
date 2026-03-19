import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../socket/socket";

import Chat from "./Chat";
import Board from "./Board";
import MyCards from "./MyCards";
import LootModal from "./LootModal";
import GuildModal from "./GuildModal";
import DungeonModal from "./DungeonModal";
import AuctionModal from "./AuctionModal";

import "./Game.css";

export default function Game() {

  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const joinedRef = useRef(false);
  
  const [convertAmount, setConvertAmount] = useState(0);

  /* ===============================
     STATE
  =============================== */

  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState(
    Array.from({ length: 32 }, () => ({
      owner: null,
      level: 0
    }))
  );

  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);

  const [showMyCards, setShowMyCards] = useState(false);

  const [lootOptions, setLootOptions] = useState([]);
  const [guildOptions, setGuildOptions] = useState([]);
  const [dungeonOptions, setDungeonOptions] = useState([]);

  const [auction, setAuction] = useState(null);
  const [swapMode, setSwapMode] = useState(false);
  const [moveBuyMode, setMoveBuyMode] = useState(false);

  /* ===============================
     MANA CHANGE SYSTEM
  =============================== */

  const [manaChanges, setManaChanges] = useState({});
  const prevPlayersRef = useRef([]);

  const detectManaChange = (newPlayers) => {

    const prev = prevPlayersRef.current;
    const changes = {};

    newPlayers.forEach(p => {
      const old = prev.find(x => x.userId === p.userId);
      if (!old) return;

      const diff = p.mana - old.mana;
      if (diff !== 0) {
        changes[p.userId] = diff;
      }
    });

    if (Object.keys(changes).length > 0) {
      setManaChanges(changes);

      setTimeout(() => {
        setManaChanges({});
      }, 1500);
    }

    prevPlayersRef.current = newPlayers;
  };

  /* ===============================
     SOCKET
  =============================== */

  useEffect(() => {

    if (!user || !roomId) return;

    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) socket.connect();

    if (!joinedRef.current) {
      socket.emit("join_room", { roomId, user });
      joinedRef.current = true;
    }

    /* HANDLERS */

    const handleRoomUpdate = (room) => {

      if (room.players) {
        detectManaChange(room.players);
        setPlayers(room.players);
      }

      if (room.status === "playing") {
        setGameStarted(true);
        setCurrentTurn(room.currentTurn ?? null);
        if (room.board) setBoard(room.board);
      }
    };
    const handleWarning = ({ message }) => {
      alert(message); // later you can replace with toast
    };
    const handleGameStarted = ({ players, board, currentTurn }) => {

      if (players) {
        prevPlayersRef.current = players;
        setPlayers(players);
      }

      setBoard(board || []);
      setCurrentTurn(currentTurn || null);
      setGameStarted(true);
    };

    const handleDiceResult = ({ players }) => {
      if (players) {
        detectManaChange(players);
        setPlayers(players);
      }
    };

    const handleTileUpdate = ({ board, players }) => {
      if (board) setBoard(board);

      if (players) {
        detectManaChange(players);
        setPlayers(players);
      }

      setAuction(null);
      setSwapMode(false);
    };

    const handleTurnUpdate = ({ currentTurn }) => {
      setCurrentTurn(currentTurn);
      setAuction(null);
    };

    const handleLootOptions = ({ userId, options }) => {
      if (String(userId) === String(user._id)) {
        setLootOptions(options || []);
      }
    };

    const handleGuildOptions = ({ userId, options }) => {
      if (String(userId) === String(user._id)) {
        setGuildOptions(options || []);
      }
    };

    const handleDungeonOptions = ({ userId, options }) => {
      if (String(userId) === String(user._id)) {
        setDungeonOptions(options || []);
      }
    };

    const handleAuctionStart = (data) => {
      setAuction({
        position: data.position,
        highestBid: 0,
        bidder: null
      });
    };

    const handleAuctionUpdate = (data) => {
      setAuction(prev => ({ ...prev, ...data }));
    };

    const handleSwapStart = ({ userId }) => {
      if (String(userId) === String(user._id)) {
        setSwapMode(true);
      }
    };

    const handleMoveBuy = ({ userId }) => {
      if (String(userId) === String(user._id)) {
        setMoveBuyMode(true);
      }
    };

    const handleGameOver = ({ winner }) => {
      alert(`🏆 Winner: ${winner?.username}`);
    };

    const handleError = (msg) => {
      alert(msg);
      navigate("/");
    };

    /* REGISTER */

    socket.on("room_update", handleRoomUpdate);
    socket.on("game_started", handleGameStarted);
    socket.on("dice_result", handleDiceResult);
    socket.on("tile_update", handleTileUpdate);
    socket.on("turn_update", handleTurnUpdate);
    socket.on("loot_options", handleLootOptions);
    socket.on("guild_options", handleGuildOptions);
    socket.on("dungeon_choice", handleDungeonOptions);
    socket.on("game_warning", handleWarning);
    socket.on("auction_start", handleAuctionStart);
    socket.on("auction_update", handleAuctionUpdate);

    socket.on("swap_start", handleSwapStart);
    socket.on("move_buy_enabled", handleMoveBuy);
    socket.on("swap_cancel", () => setSwapMode(false));

    socket.on("game_over", handleGameOver);
    socket.on("error_message", handleError);
    socket.on("auction_end", () => setAuction(null));

    return () => {
      socket.off("room_update", handleRoomUpdate);
      socket.off("game_started", handleGameStarted);
      socket.off("dice_result", handleDiceResult);
      socket.off("tile_update", handleTileUpdate);
      socket.off("turn_update", handleTurnUpdate);
      socket.off("loot_options", handleLootOptions);
      socket.off("guild_options", handleGuildOptions);
      socket.off("dungeon_choice", handleDungeonOptions);
      socket.off("auction_start", handleAuctionStart);
      socket.off("auction_update", handleAuctionUpdate);
      socket.off("swap_start", handleSwapStart);
      socket.off("move_buy_enabled", handleMoveBuy);
      socket.off("game_over", handleGameOver);
      socket.off("error_message", handleError);
      socket.off("game_warning", handleWarning);
    };

  }, [roomId, user, navigate]);

  const socket = socketRef.current;

  /* ===============================
     ACTIONS
  =============================== */

  const handleLootSelect = (cardId) => {
    socket.emit("select_loot", { roomId, userId: user._id, cardId });
    setLootOptions([]);
  };

  const handleGuildSelect = (cardId) => {
    socket.emit("select_guild", { roomId, userId: user._id, cardId });
    setGuildOptions([]);
  };

  const handleDungeonSelect = (choice) => {
    socket.emit("select_dungeon", { roomId, userId: user._id, choice });
    setDungeonOptions([]);
  };

  const handleBid = (amount) => {
    socket.emit("place_bid", { roomId, userId: user._id, amount });
  };

  const handleConvert = () => {
    if (!convertAmount || convertAmount <= 0) return;

    socket.emit("convert_coins", {
      roomId,
      userId: user._id,
      amount: convertAmount
    });

    setConvertAmount(0);
  };

  if (!user) return null;

  const myPlayer = players.find(
    p => String(p.userId) === String(user._id)
  );

  /* ===============================
     UI
  =============================== */

  return (
    <div className="game-root">

      <div className="game-area">

        {gameStarted && (
          <div className="player-stats">
            {players.map((p, i) => (
              <div
                key={p.userId}
                className={`player-stat ${
                  String(currentTurn) === String(p.userId) ? "active" : ""
                }`}
              >
                <div className="player-name">
                  {i + 1}. {p.username}

                  {manaChanges[p.userId] && (
                    <span className={`mana-change ${
                      manaChanges[p.userId] > 0 ? "plus" : "minus"
                    }`}>
                      {manaChanges[p.userId] > 0 ? "+" : ""}
                      {manaChanges[p.userId]}
                    </span>
                  )}

                  {String(p.userId) === String(user._id) && (
                    <span
                      className="cards-icon"
                      onClick={() => setShowMyCards(v => !v)}
                    >
                      🃏
                    </span>
                  )}
                </div>

                <div>Mana: {p.mana}</div>
              </div>
            ))}
          </div>
        )}

        {!gameStarted ? (
          <div className="waiting-screen">
            Waiting for game...
          </div>
        ) : (
          <Board
            players={players}
            roomId={roomId}
            currentTurn={currentTurn}
            board={board}
            swapMode={swapMode}
            moveBuyMode={moveBuyMode}
          />
        )}

      </div>

      {showMyCards && <MyCards board={board} user={user} />}

      {lootOptions.length > 0 && <LootModal options={lootOptions} onSelect={handleLootSelect} />}
      {guildOptions.length > 0 && <GuildModal options={guildOptions} onSelect={handleGuildSelect} />}
      {dungeonOptions.length > 0 && <DungeonModal options={dungeonOptions} onSelect={handleDungeonSelect} />}
      {auction && <AuctionModal auction={auction} onBid={handleBid} />}

      <Chat roomId={roomId} />

      <div className="game-footer">
        <button onClick={() => {
          const socket = socketRef.current;
          if (socket) {
            socket.emit("leave_room", { roomId, userId: user._id });
            socket.disconnect();
          }
          navigate("/");
        }}>
          Leave Game
        </button>
      </div>

      {myPlayer && myPlayer.mana <= 50 && (
        <div className="convert-box">
          <div className="convert-title">💱 Convert Coins → Mana</div>

          <div className="convert-info">
            Coins: {myPlayer.coins} | Mana: {myPlayer.mana}
          </div>

          <div className="convert-controls">
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(Number(e.target.value))}
              min={1}
            />
            <button onClick={handleConvert}>Convert</button>
          </div>
        </div>
      )}

    </div>
  );
}