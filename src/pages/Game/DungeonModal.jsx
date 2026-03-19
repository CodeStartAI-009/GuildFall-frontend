import "./DungeonModal.css";

export default function DungeonModal({ options, onSelect }) {

  return (
    <div className="modal">

      <h2>🏰 Lower Dungeon</h2>
      <p>Choose your fate:</p>

      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
        >
          {opt.text}
        </button>
      ))}

      {/* 🔥 NEW OPTION */}
      <button
        className="jail-free-btn"
        onClick={() => onSelect("jail_free")}
      >
        💰 Use Coins (30) → Escape
      </button>

    </div>
  );
}