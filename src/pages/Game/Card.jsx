import "./card.css";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../socket/socket";
import { useState, useEffect } from "react";
import { detailsData } from "./Details";
import clawImg from "../../assets/game/claw.png";

export default function Card({
  tile,
  owner,
  level = 0,
  roomId,
  position,
  playerMana = 0,
  onSkip
}) {

  const socket = getSocket();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showClaw, setShowClaw] = useState(false);
  const [showCard, setShowCard] = useState(false);

  if (!tile) return null;

  const data = detailsData[tile.label];
  if (!data) return null;

  /* ===============================
     COST
  =============================== */

  const buyCost = data.levels[0].cost;

  let upgradeCost = 0;
  if (level === 1) upgradeCost = data.levels[1].cost;
  if (level === 2) upgradeCost = data.levels[2].cost;

  const penalty =
    level > 0
      ? Math.floor(data.levels[level - 1].cost * 0.5)
      : 0;

  /* ===============================
     OWNERSHIP
  =============================== */

  const isOwned = !!owner;
  const isMine = isOwned && String(owner) === String(user?._id);
  const ownedByOther = isOwned && !isMine;

  const maxLevel = level >= 3;

  const canBuy = playerMana >= buyCost;
  const canUpgrade = playerMana >= upgradeCost;

  /* ===============================
     IMAGE LOGIC
  =============================== */

  const currentLevelIndex = level > 0 ? level - 1 : 0;

  const displayImage =
    data.levels[currentLevelIndex]?.image ||
    data.levels[0]?.image;

  const nextImage =
    data.levels[level]?.image || null;

  /* ===============================
     CLAW EFFECT
  =============================== */

  useEffect(() => {

    if (ownedByOther) {
      setShowClaw(true);
      setShowCard(false);

      const timer = setTimeout(() => {
        setShowClaw(false);
        setShowCard(true);

        /* 🔥 AUTO CLOSE AFTER RENT */
        setTimeout(() => {
          onSkip && onSkip();
        }, 1000);

      }, 1200);

      return () => clearTimeout(timer);

    } else {
      setShowCard(true);
    }

  }, [ownedByOther]);

  /* ===============================
     SOCKET UPDATE
  =============================== */

  useEffect(() => {

    const handleUpdate = () => {
      setLoading(false);
      onSkip && onSkip(); // 🔥 CLOSE AFTER ACTION
    };

    socket.on("tile_update", handleUpdate);

    return () => {
      socket.off("tile_update", handleUpdate);
    };

  }, [socket]);

  /* ===============================
     BUY
  =============================== */

  const handleBuy = () => {

    if (!user || loading) return;

    if (!canBuy) return;

    setLoading(true);

    socket.emit("buy_tile", {
      roomId,
      userId: user._id,
      position
    });

  };

  /* ===============================
     UPGRADE
  =============================== */

  const handleUpgrade = () => {

    if (!user || loading) return;

    if (!canUpgrade) return;

    setLoading(true);

    socket.emit("upgrade_tile", {
      roomId,
      userId: user._id,
      position
    });

  };

  /* ===============================
     CLAW UI
  =============================== */

  if (showClaw) {
    return (
      <div className="claw-overlay">
        <img src={clawImg} alt="claw" className="claw-image" />
      </div>
    );
  }

  if (!showCard) return null;

  /* ===============================
     UI
  =============================== */

  return (

    <div className="card">

      {/* IMAGE */}
      <div className="card-image">
        {displayImage ? (
          <img src={displayImage} alt={tile.label} />
        ) : (
          <div className="card-placeholder">{tile.label}</div>
        )}
      </div>

      <div className="card-title">{tile.label}</div>

      {isOwned && (
        <div className="card-level">Level {level}</div>
      )}

      {/* NOT OWNED */}
      {!isOwned && (
        <div className="card-actions">

          <div className="card-cost">
            Tame Cost: {buyCost}
          </div>

          {!canBuy && (
            <div className="card-warning">
              ❌ Not enough mana
            </div>
          )}

          <button
            className="card-btn tame"
            onClick={handleBuy}
            disabled={!canBuy || loading}
          >
            {loading ? "Processing..." : "Tame"}
          </button>

          <button
            className="card-btn skip"
            onClick={onSkip}
          >
            Skip
          </button>

        </div>
      )}

      {/* OWNED BY OTHER */}
      {ownedByOther && (
        <div className="card-actions">

          <div className="card-penalty">
            💀 Paid Mana: {penalty}
          </div>

        </div>
      )}

      {/* OWNED BY YOU */}
      {isMine && !maxLevel && (
        <div className="card-actions">

          {nextImage && (
            <div className="card-upgrade-preview">
              <img src={nextImage} alt="next" />
              <span>Next Form</span>
            </div>
          )}

          <div className="card-upgrade-cost">
            Upgrade: {upgradeCost}
          </div>

          {!canUpgrade && (
            <div className="card-warning">
              ❌ Not enough mana
            </div>
          )}

          <button
            className="card-btn upgrade"
            onClick={handleUpgrade}
            disabled={!canUpgrade || loading}
          >
            {loading ? "Processing..." : "Upgrade"}
          </button>

          <button
            className="card-btn skip"
            onClick={onSkip}
          >
            Skip
          </button>

        </div>
      )}

      {/* MAX LEVEL */}
      {isMine && maxLevel && (
        <div className="card-actions">

          <div className="card-max">
            ⭐ Max Level
          </div>

          <button
            className="card-btn skip"
            onClick={onSkip}
          >
            Continue
          </button>

        </div>
      )}

    </div>
  );
}