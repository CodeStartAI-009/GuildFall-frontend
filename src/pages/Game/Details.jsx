import "./Details.css";

/* =================================
   TILE DATA (EXPORTED FOR CARD USE)
================================= */

export const detailsData = {

/* 🔥 EMBER REGION */

"Flame Drake": {
region:"🔥 Ember Region",
levels:[
{level:"Level I",name:"Tamed Flame Drake",cost:60},
{level:"Level II",name:"Inferno Drake",cost:90},
{level:"Level III",name:"Cataclysm Drake",cost:135}
]
},

"Cinder Wolf": {
region:"🔥 Ember Region",
levels:[
{level:"Level I",name:"Ember Cinder Wolf",cost:70},
{level:"Level II",name:"Blaze Alpha",cost:105},
{level:"Level III",name:"Infernal Direwolf",cost:158}
]
},

"Magma Serpent": {
region:"🔥 Ember Region",
levels:[
{level:"Level I",name:"Molten Serpent",cost:80},
{level:"Level II",name:"Volcanic Serpent",cost:120},
{level:"Level III",name:"Worldbreaker Serpent",cost:180}
]
},

/* 🌊 TIDAL REGION */

"Leviathan Cub": {
region:"🌊 Tidal Region",
levels:[
{level:"Level I",name:"Young Leviathan",cost:100},
{level:"Level II",name:"Deep Leviathan",cost:150},
{level:"Level III",name:"Abyss Leviathan",cost:225}
]
},

"Coral Hydra": {
region:"🌊 Tidal Region",
levels:[
{level:"Level I",name:"Three Head Hydra",cost:110},
{level:"Level II",name:"Five Head Hydra",cost:165},
{level:"Level III",name:"Ocean Tyrant Hydra",cost:248}
]
},

"Mist Serpent": {
region:"🌊 Tidal Region",
levels:[
{level:"Level I",name:"Vapor Serpent",cost:120},
{level:"Level II",name:"Storm Mist Serpent",cost:180},
{level:"Level III",name:"Tempest Phantom",cost:270}
]
},

/* 🌲 SYLVAN REGION */

"Thorn Treant": {
region:"🌲 Sylvan Region",
levels:[
{level:"Level I",name:"Forest Treant",cost:140},
{level:"Level II",name:"Grove Guardian",cost:210},
{level:"Level III",name:"Worldroot Colossus",cost:315}
]
},

"Moon Stag": {
region:"🌲 Sylvan Region",
levels:[
{level:"Level I",name:"Spirit Moon Stag",cost:150},
{level:"Level II",name:"Celestial Stag",cost:225},
{level:"Level III",name:"Lunar Sovereign",cost:338}
]
},

"Root Basilisk": {
region:"🌲 Sylvan Region",
levels:[
{level:"Level I",name:"Forest Basilisk",cost:160},
{level:"Level II",name:"Thorn Basilisk",cost:240},
{level:"Level III",name:"Petrifier King",cost:360}
]
},

/* ⚡ STORM REGION */

"Thunder Roc": {
region:"⚡ Storm Region",
levels:[
{level:"Level I",name:"Storm Roc",cost:180},
{level:"Level II",name:"Sky Sovereign",cost:270},
{level:"Level III",name:"Tempest Emperor",cost:405}
]
},

"Sky Wyrm": {
region:"⚡ Storm Region",
levels:[
{level:"Level I",name:"Wind Wyrm",cost:190},
{level:"Level II",name:"Storm Wyrm",cost:285},
{level:"Level III",name:"Sky Devastator",cost:428}
]
},

"Tempest Lynx": {
region:"⚡ Storm Region",
levels:[
{level:"Level I",name:"Storm Lynx",cost:200},
{level:"Level II",name:"Thunder Hunter",cost:300},
{level:"Level III",name:"Tempest Predator",cost:450}
]
},

/* 🌑 SHADOW REGION */

"Night Chimera": {
region:"🌑 Shadow Region",
levels:[
{level:"Level I",name:"Shadow Chimera",cost:250},
{level:"Level II",name:"Dread Chimera",cost:375},
{level:"Level III",name:"Abyss Monarch",cost:563}
]
},

"Void Dragon": {
region:"🌑 Shadow Region",
levels:[
{level:"Level I",name:"Void Wyrm",cost:300},
{level:"Level II",name:"Cosmic Devourer",cost:450},
{level:"Level III",name:"Void Sovereign",cost:675}
]
}

};
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

/* =================================
   DETAILS COMPONENT
================================= */

export default function Details({
  label,
  position,
  board = [],
  players = [],
  user
}) {

  if (!label) return null;

  const data = detailsData[label];
  if (!data) return null;

  /* ===============================
     GET TILE FROM BOARD
  =============================== */

  const tile = board[position];

  let ownerName = null;
  let isMine = false;

  if (tile && tile.owner) {

    const player = players.find(p => p.userId === tile.owner);

    ownerName = player?.username || "Unknown Player";

    isMine = user && tile.owner === user._id;
  }

  return (

    <div className="details-box">

      <h2>{label}</h2>

      <h4>{data.region}</h4>

      {/* ===============================
         OWNER INFO
      =============================== */}

      {ownerName && (

        <div className="details-owner">

          {isMine ? (
            <span style={{ color: "#4CAF50" }}>
              Owned by You
            </span>
          ) : (
            <>
              Owned by: <span>{ownerName}</span>
            </>
          )}

        </div>

      )}

      {/* ===============================
         TABLE
      =============================== */}

      <table className="details-table">

        <thead>
          <tr>
            <th>Level</th>
            <th>Name</th>
            <th>Mana</th>
          </tr>
        </thead>

        <tbody>

          {data.levels.map((lvl, index) => (
            <tr key={index}>
              <td>{lvl.level}</td>
              <td>{lvl.name}</td>
              <td>{lvl.cost}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}