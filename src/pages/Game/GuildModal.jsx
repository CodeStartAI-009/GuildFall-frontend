import "./LootModal.css";

export default function GuildModal({ options, onSelect }) {

  if (!options.length) return null;

  return (

    <div className="loot-overlay">

      <div className="loot-modal">

        <h2 className="loot-title">⚔️ Guild Battle</h2>

        <div className="loot-cards">

          {options.map(card => (

            <div
              key={card.id}
              className="loot-card"
              onClick={() => onSelect(card.id)}
            >
              <div className="loot-card-inner">
                <div className="loot-card-text">
                  {card.text}
                </div>
              </div>
            </div>

          ))}

        </div>

      </div>

    </div>

  );

}