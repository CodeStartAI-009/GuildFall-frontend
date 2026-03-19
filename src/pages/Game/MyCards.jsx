import { detailsData } from "./Details";
import "./MyCards.css";

/* ===============================
   POSITION → CREATURE MAP
=============================== */

const creatureMap = {
  1: "Flame Drake",
  3: "Cinder Wolf",
  5: "Magma Serpent",

  9: "Leviathan Cub",
  11: "Coral Hydra",
  13: "Mist Serpent",

  17: "Thorn Treant",
  19: "Moon Stag",
  21: "Root Basilisk",

  25: "Thunder Roc",
  27: "Sky Wyrm",
  29: "Tempest Lynx",

  30: "Night Chimera",
  31: "Void Dragon"
};

/* ===============================
   COMPONENT
=============================== */

export default function MyCards({ board = [], user }) {

  if (!user) return null;

  /* ===============================
     FILTER MY TILES
  =============================== */

  const myTiles = board
    .map((tile, index) => ({
      ...tile,
      position: index
    }))
    .filter(tile =>
      tile.owner &&
      String(tile.owner) === String(user._id)
    );

  /* ===============================
     EMPTY STATE
  =============================== */

  if (myTiles.length === 0) {
    return (
      <div className="mycards-container">
        <div className="mycards-empty">
          🐉 No creatures owned yet
        </div>
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (

    <div className="mycards-container">

      <div className="mycards-header">
        My Creatures ({myTiles.length})
      </div>

      <div className="mycards-grid">

        {myTiles.map(tile => {

          const label = creatureMap[tile.position];
          const data = detailsData[label];

          const level = tile.level || 0;

          const value =
            level > 0 && data
              ? data.levels[level - 1]?.cost || 0
              : 0;

          return (

            <div
              key={tile.position}
              className="mycard"
            >

            
              <div className="mycard-title">
                {label || "Unknown"}
              </div>

              {/* LEVEL */}
              <div className="mycard-level">
                Level {level}
              </div>

               

            </div>

          );

        })}

      </div>

    </div>

  );

}