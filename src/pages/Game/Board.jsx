import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../socket/socket";
import { detailsData } from "./Details";

import "./Board.css";
import Dice from "./Dice";
import Details from "./Details";
import Card from "./Card";

/* CORNER IMAGES */
import guildHallImg from "../../assets/icons/guild.png";
import lowerDungeonImg from "../../assets/icons/lower.png";
import grandLibraryImg from "../../assets/icons/grand.png";
import highDungeonImg from "../../assets/icons/high.png";

const socket = getSocket();
const SIZE = 9;

/* ===============================
   TILE DEFINITIONS
=============================== */

const tiles = [
  { type: "corner", label: "Guild Hall" },
  { type: "fire", label: "Flame Drake" },
  { type: "loot", label: "Loot Box" },
  { type: "fire", label: "Cinder Wolf" },
  { type: "drain", label: "Mana Drain" },
  { type: "fire", label: "Magma Serpent" },
  { type: "mana", label: "Mana Well" },
  { type: "fire", label: "Guild Battle" },

  { type: "corner", label: "Lower Dungeon" },

  { type: "water", label: "Leviathan Cub" },
  { type: "loot", label: "Loot Box" },
  { type: "water", label: "Coral Hydra" },
  { type: "mana", label: "Mana Well" },
  { type: "water", label: "Mist Serpent" },
  { type: "drain", label: "Mana Drain" },
  { type: "fire", label: "Guild Battle" },

  { type: "corner", label: "Grand Library" },

  { type: "earth", label: "Thorn Treant" },
  { type: "loot", label: "Loot Box" },
  { type: "earth", label: "Moon Stag" },
  { type: "drain", label: "Mana Drain" },
  { type: "earth", label: "Root Basilisk" },
  { type: "mana", label: "Mana Well" },
  { type: "fire", label: "Guild Battle" },

  { type: "corner", label: "High Dungeon" },

  { type: "air", label: "Thunder Roc" },
  { type: "mana", label: "Mana Well" },
  { type: "air", label: "Sky Wyrm" },
  { type: "loot", label: "Loot Board" },
  { type: "air", label: "Tempest Lynx" },
  { type: "shadow", label: "Night Chimera" },
  { type: "shadow", label: "Void Dragon" }
];

const cornerImages = {
  "Guild Hall": guildHallImg,
  "Lower Dungeon": lowerDungeonImg,
  "Grand Library": grandLibraryImg,
  "High Dungeon": highDungeonImg
};

/* ===============================
   GRID + PATH
=============================== */

function generateBoard() {
  const board = Array.from({ length: SIZE * SIZE }, () => ({
    type: "center",
    label: ""
  }));

  let index = 0;

  for (let col = 0; col < SIZE; col++) board[col] = tiles[index++];
  for (let row = 1; row < SIZE - 1; row++)
    board[row * SIZE + (SIZE - 1)] = tiles[index++];
  for (let col = SIZE - 1; col >= 0; col--)
    board[(SIZE - 1) * SIZE + col] = tiles[index++];
  for (let row = SIZE - 2; row > 0; row--)
    board[row * SIZE] = tiles[index++];

  return board;
}

function generatePath() {
  const path = [];
  for (let col = 0; col < SIZE; col++) path.push(col);
  for (let row = 1; row < SIZE - 1; row++)
    path.push(row * SIZE + (SIZE - 1));
  for (let col = SIZE - 1; col >= 0; col--)
    path.push((SIZE - 1) * SIZE + col);
  for (let row = SIZE - 2; row > 0; row--)
    path.push(row * SIZE);
  return path;
}

const visualBoard = generateBoard();
const PATH = generatePath();

/* ===============================
   COMPONENT
=============================== */

export default function Board({
  players = [],
  roomId,
  currentTurn,
  board = [],
  swapMode = false,
  moveBuyMode = false
}) {

  const { user } = useAuth();

  const [hoverTile, setHoverTile] = useState(null);
  const [activeTile, setActiveTile] = useState(null);
  const [swapSelection, setSwapSelection] = useState(null);

  const lastPositionRef = useRef(null);
  const cardTimerRef = useRef(null);

  /* ===============================
     SHOW CARD
  =============================== */

  useEffect(() => {

    const me = players.find(p => p.userId === user?._id);
    if (!me) return;

    if (lastPositionRef.current === me.position) return;
    lastPositionRef.current = me.position;

    let position = me.position;
    if (position === 24) position = 8;

    const tile = visualBoard[PATH[position]];
    if (!tile || tile.type === "corner") return;

    const state = board[position];

    setActiveTile({
      ...tile,
      owner: state?.owner,
      level: state?.level || 0,
      position
    });

    clearTimeout(cardTimerRef.current);
    cardTimerRef.current = setTimeout(() => {
      setActiveTile(null);
    }, 5000);

  }, [players, board, user]);

  /* ===============================
     CLICK HANDLER
  =============================== */
 
  const handleTileClick = (i) => {

    const pathIndex = PATH.findIndex(p => p === i);
    if (pathIndex === -1) return;

    const tileState = board[pathIndex];

    /* ===============================
       MOVE BUY
    =============================== */

    if (moveBuyMode) {

      if (tileState?.owner) return; // ❌ can't buy owned tile

      socket.emit("move_buy_select", {
        roomId,
        userId: user._id,
        position: pathIndex
      });

      return;
    }

    /* ===============================
       SWAP SYSTEM (IMPROVED)
    =============================== */

    if (swapMode) {

      const isMine =
        String(tileState?.owner) === String(user._id);

      /* STEP 1: SELECT YOUR TILE */
      if (!swapSelection) {

        if (!isMine) return; // must pick own tile first

        setSwapSelection(pathIndex);
        return;
      }

      /* STEP 2: SELECT TARGET TILE */
      if (swapSelection !== null) {

        if (isMine) return; // can't pick own again
        if (!tileState?.owner) return; // must be owned

        socket.emit("swap_select", {
          roomId,
          userId: user._id,
          myTile: swapSelection,
          targetTile: pathIndex
        });

        setSwapSelection(null);
      }
    }
  };

  const myPlayer = players.find(p => p.userId === user?._id);
  const myMana = myPlayer?.mana || 0;

  /* ===============================
     RENDER
  =============================== */

  return (

    <div className="board-wrapper">

      <div className="guildfall-board">

        {visualBoard.map((tile, i) => {

          const isCenter = tile.type === "center";
          const isCorner = tile.type === "corner";

          const pathIndex = PATH.findIndex(p => p === i);

          return (

            <div
              key={i}
              className={`board-cell ${tile.type}
                ${swapSelection === pathIndex ? "selected-tile" : ""}
              `}
              onClick={() => handleTileClick(i)}
              onMouseEnter={() => {
                if (pathIndex !== -1) {
                  setHoverTile({
                    label: tile.label,
                    position: pathIndex
                  });
                }
              }}
              onMouseLeave={() => setHoverTile(null)}
            >

              {isCorner && (
                <img
                  src={cornerImages[tile.label]}
                  className="corner-image"
                  alt=""
                />
              )}

              {!isCenter && !isCorner && tile.label}

              <div className="player-container">
                {players
                  .filter(p => PATH[p.position] === i)
                  .map(p => (
                    <div key={p.userId} className="player-token">
                      {players.findIndex(x => x.userId === p.userId) + 1}
                    </div>
                  ))}
              </div>

            </div>

          );

        })}

      </div>

      <div className="board-center-ui">

        {activeTile ? (
          <Card
            tile={activeTile}
            owner={activeTile.owner}
            level={activeTile.level}
            position={activeTile.position}
            roomId={roomId}
            playerMana={myMana}
            onSkip={() => setActiveTile(null)}
          />
        ) : hoverTile ? (
          <Details
            label={hoverTile.label}
            position={hoverTile.position}
            board={board}
            players={players}
            user={user}
          />
        ) : (
          <Dice
            roomId={roomId}
            currentTurn={currentTurn}
          />
        )}

      </div>

    </div>

  );
}