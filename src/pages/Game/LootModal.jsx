import "./LootModal.css";
import { useState } from "react";

export default function LootModal({
  options = [],
  onSelect
}) {

  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!options || options.length === 0) return null;

  const handleClick = (index, cardId) => {

    if (selectedIndex !== null) return; // prevent double click

    setSelectedIndex(index);

    /* delay to show flip animation */

    setTimeout(() => {
      onSelect(cardId);
    }, 1000);
  };

  return (

    <div className="loot-overlay">

      <div className="loot-modal">

        <h2 className="loot-title">🎁 Pick a Card</h2>

        <div className="loot-cards">

          {options.map((card, index) => {

            const isFlipped = selectedIndex === index;

            return (

              <div
                key={card.id}
                className="loot-card"
                onClick={() => handleClick(index, card.id)}
              >

                <div className={`loot-card-inner ${isFlipped ? "flipped" : ""}`}>

                  {/* FRONT (BACK SIDE OF CARD) */}
                  <div className="loot-card-front">
                    ?
                  </div>

                  {/* BACK (ACTUAL CARD) */}
                  <div className="loot-card-back">
                    <div className="loot-card-text">
                      {card.text}
                    </div>
                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}