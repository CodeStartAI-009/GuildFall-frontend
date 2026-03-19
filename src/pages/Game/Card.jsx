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
     COST (UI ONLY)
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
     OWNERSHIP (FIXED)
  =============================== */

  const isOwned = !!owner;
  const isMine = isOwned && user && String(owner) === String(user._id);
  const ownedByOther = isOwned && !isMine;

  const maxLevel = level >= 3;

  const canBuy = playerMana >= buyCost;
  const canUpgrade = playerMana >= upgradeCost;

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
      }, 1200);

      return () => clearTimeout(timer);

    } else {
      setShowCard(true);
    }

  }, [ownedByOther]);

  /* ===============================
     SOCKET RESPONSE LISTENER
  =============================== */

  useEffect(() => {

    const handleUpdate = () => {
      setLoading(false);
    };

    socket.on("tile_update", handleUpdate);

    return () => {
      socket.off("tile_update", handleUpdate);
    };

  }, [socket]);

  /* ===============================
     BUY (FIXED)
  =============================== */

  const handleBuy = () => {

    if (!user || loading) return;

    if (!canBuy) {
      alert("Not enough mana");
      return;
    }

    setLoading(true);

    socket.emit("buy_tile", {
      roomId,
      userId: user._id,
      position // ❌ no cost sent
    });

    // ❌ DO NOT close immediately
  };

  /* ===============================
     UPGRADE (FIXED)
  =============================== */

  const handleUpgrade = () => {

    if (!user || loading) return;

    if (!canUpgrade) {
      alert("Not enough mana");
      return;
    }

    setLoading(true);

    socket.emit("upgrade_tile", {
      roomId,
      userId: user._id,
      position // ❌ no cost
    });

  };

  /* ===============================
     CLAW OVERLAY
  =============================== */

  if (showClaw) {
    return (
      <div className="claw-overlay">
        <img
          src={clawImg}
          alt="claw"
          className="claw-image"
        />
      </div>
    );
  }

  if (!showCard) return null;

  /* ===============================
     UI
  =============================== */

  return (

    <div className="card">

      <div className="card-image">
        {tile?.image ? (
          <img src={tile.image} alt={tile.label} />
        ) : (
          <div className="card-placeholder">
            {tile.label}
          </div>
        )}
      </div>

      <div className="card-title">
        {tile.label}
      </div>

      {isOwned && (
        <div className="card-level">
          Level {level}
        </div>
      )}

      {/* NOT OWNED */}
      {!isOwned && (

        <div className="card-actions">

          <div className="card-cost">
            Tame Cost: {buyCost}
          </div>

          <button
            className="card-btn tame"
            onClick={handleBuy}
            disabled={!canBuy || loading}
          >
            {loading ? "Processing..." : "Tame Creature"}
          </button>

          <button
            className="card-btn skip"
            onClick={onSkip}
            disabled={loading}
          >
            Skip
          </button>

        </div>

      )}

      {/* OWNED BY OTHER */}
      {ownedByOther && (

        <div className="card-actions">

          <div className="card-penalty">
            Pay Mana: {penalty}
          </div>

          <button className="card-btn skip" onClick={onSkip}>
            Continue
          </button>

        </div>

      )}

      {/* OWNED BY YOU */}
      {isMine && !maxLevel && (

        <div className="card-actions">

          <div className="card-upgrade-cost">
            Upgrade: {upgradeCost}
          </div>

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
            disabled={loading}
          >
            Skip
          </button>

        </div>

      )}

      {/* MAX */}
      {isMine && maxLevel && (

        <div className="card-actions">

          <div className="card-max">
            Max Level
          </div>

          <button className="card-btn skip" onClick={onSkip}>
            Continue
          </button>

        </div>

      )}

    </div>

  );

}